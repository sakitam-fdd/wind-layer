import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/common.vert.glsl';
import frag from '../../../shaders/compose.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { RenderFrom, BandType } from '../../../type';
import { littleEndian } from '../../../utils/common';
import TileID from '../../../tile/TileID';
import { SourceType } from '../../../source';

export interface ParticlesComposePassOptions {
  source: SourceType;
  bandType: BandType;
  renderFrom: RenderFrom;
  stencilConfigForOverlap: (tiles: any[]) => [{ [_: number]: any }, TileID[]];
  getTileProjSize: (z: number, tiles: TileID[]) => [number, number];
}

const defaultSize = 256;

/**
 * 按区域加载视图范围内的瓦片，然后合并单张纹理
 */
export default class ParticlesComposePass extends Pass<ParticlesComposePassOptions> {
  readonly prerender = true;

  #program: WithNull<Program>;
  #current: WithNull<RenderTarget>;
  #next: WithNull<RenderTarget>;
  #uid: string;

  #width = defaultSize;
  #height = defaultSize;

  constructor(
    id: string,
    renderer: Renderer,
    options: ParticlesComposePassOptions = {} as ParticlesComposePassOptions,
  ) {
    super(id, renderer, options);

    this.#uid = utils.uid('ParticlesComposePass');

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        u_image0: {
          value: undefined,
        },
        dataRange: {
          value: undefined,
        },
      },
      defines: [`RENDER_TYPE ${this.options.bandType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
    });

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.#width,
      height: this.#height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.FLOAT,
      format: this.renderer.gl.RGBA,
      // generateMipmaps: false,
      internalFormat: this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA,
      stencil: true,
    };

    this.#current = new RenderTarget(renderer, {
      ...opt,
      name: 'currentRenderTargetTexture',
    });
    this.#next = new RenderTarget(renderer, {
      ...opt,
      name: 'nextRenderTargetTexture',
    });
  }

  resize(width: number, height: number) {
    if (width !== this.#width || height !== this.#height) {
      this.#current?.resize(width, height);
      this.#next?.resize(width, height);
      this.#width = width;
      this.#height = height;
    }
  }

  get textures() {
    return {
      current: this.#current?.texture,
      next: this.#next?.texture,
    };
  }

  renderTexture(renderTarget, rendererParams, rendererState, sourceCache) {
    if (!sourceCache) {
      return;
    }

    const { stencilConfigForOverlap } = this.options;
    const camera = rendererParams.cameras.planeCamera;
    const coordsAscending = sourceCache.getVisibleCoordinates();
    const coordsDescending = coordsAscending.slice().reverse(); // offscreen & opaque

    if (!coordsDescending.length) return;

    let xmin = Infinity;
    let ymin = Infinity;
    let xmax = -Infinity;
    let ymax = -Infinity;
    let zmin = Infinity;
    let zmax = -Infinity;
    // 1. 计算mapbox墨卡托坐标的最大最小值，构建真实瓦片范围
    // 注意这里不要直接使用图层计算的原始瓦片范围，因为在加载过程中有可能会有失败，我
    // 们应该取真实加载后的瓦片计算范围
    // mapbox 的坐标原点是左上角
    for (let n = 0; n < coordsDescending.length; n++) {
      const tileId = coordsDescending[n];
      const bounds = tileId.getTileProjBounds();
      // @todo 不同引擎的top 和 bottom 方向可能不一样
      xmin = Math.min(bounds.left, xmin);
      xmax = Math.max(bounds.right, xmax);
      zmin = Math.min(tileId.z, zmin);
      zmax = Math.max(tileId.z, zmax);

      if (!rendererState.u_flip_y) {
        ymin = Math.min(bounds.top, ymin);
        ymax = Math.max(bounds.bottom, ymax);
      } else {
        ymin = Math.min(bounds.bottom, ymin);
        ymax = Math.max(bounds.top, ymax);
      }
    }

    const zz = this.options.getTileProjSize(zmax, coordsDescending);

    const dx = xmax - xmin;
    const dy = ymax - ymin;

    // 2. 计算 x 方向和 y 方向的行列数
    const w = dx / zz[0];
    const h = dy / zz[1];

    // TODO: 瓦片范围和行列数是否可以提到瓦片计算的时候获取，可以减少几次循环

    rendererState.sharedState.u_data_bbox = [xmin, ymin, xmax, ymax];

    if (renderTarget) {
      renderTarget.clear();
      renderTarget.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && renderTarget.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }

      // 3. 计算出 fbo 所需大小 (此处有可能计算的宽高超出纹理最大大小，我们需要根据宽高比例进行重采样)
      let width = w * (this.options.source.tileSize ?? defaultSize);
      let height = h * (this.options.source.tileSize ?? defaultSize);
      const maxTextureSize = this.renderer.gl.getParameter(this.renderer.gl.MAX_TEXTURE_SIZE) * 0.5;
      const maxRenderBufferSize =
        this.renderer.gl.getParameter(this.renderer.gl.MAX_RENDERBUFFER_SIZE) * 0.5;
      const maxSize = Math.max(width, height);
      if (maxSize > maxTextureSize) {
        width = (maxTextureSize / maxSize) * width;
        height = (maxTextureSize / maxSize) * height;
      } else if (maxSize > maxRenderBufferSize) {
        width = (maxRenderBufferSize / maxSize) * width;
        height = (maxRenderBufferSize / maxSize) * height;
      }

      this.resize(width, height);

      this.renderer.setViewport(width, height);
    }

    const [stencilModes, coords] = stencilConfigForOverlap(coordsDescending);

    // 4. 循环 TileID，从 sourceCache 查找对应瓦片渲染（默认是从视野中心向两边渲染）
    for (let k = 0; k < coords.length; k++) {
      const coord = coords[k];
      // 5. 进行渲染
      if (coord) {
        const tile = sourceCache.getTile(coord);
        if (!(tile && tile.hasData())) continue;

        const tileBBox = coord.getTileProjBounds();
        if (!tileBBox) continue;

        const tileMesh = tile.createMesh(this.#uid, tileBBox, this.renderer, this.#program);
        const mesh = tileMesh.planeMesh;

        const scale = Math.pow(2, zmax - coord.z);
        mesh.scale.set((1 / w) * scale, (1 / h) * scale, 1);
        if (!rendererState.u_flip_y) {
          mesh.position.set((tileBBox.left - xmin) / dx, (tileBBox.top - ymin) / dy, 0);
        } else {
          mesh.position.set((tileBBox.left - xmin) / dx, (tileBBox.bottom - ymin) / dy, 0);
        }

        const dataRange: number[] = [];
        for (const [index, texture] of tile.textures) {
          if (texture.userData?.dataRange && Array.isArray(texture.userData?.dataRange)) {
            dataRange.push(...texture.userData.dataRange);
          }
          mesh.program.setUniform(`u_image${index}`, texture);
        }

        if (dataRange.length > 0) {
          mesh.program.setUniform('dataRange', dataRange);
        }

        mesh.updateMatrix();
        mesh.worldMatrixNeedsUpdate = false;
        mesh.worldMatrix.multiply(camera.worldMatrix, mesh.localMatrix);

        const stencilMode = stencilModes[coord.overscaledZ];

        if (stencilMode) {
          if (stencilMode.stencil) {
            this.renderer.state.enable(this.renderer.gl.STENCIL_TEST);

            this.renderer.state.setStencilFunc(
              stencilMode.func?.cmp,
              stencilMode.func?.ref,
              stencilMode.func?.mask,
            );
            this.renderer.state.setStencilOp(
              stencilMode.op?.fail,
              stencilMode.op?.zfail,
              stencilMode.op?.zpass,
            );
          } else {
            this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
          }
        }

        mesh.draw({
          ...utils.omit(rendererParams, ['target']),
          camera,
        });
      }
    }

    if (renderTarget) {
      renderTarget.unbind();
    }
  }

  /**
   * 此处绘制主要是合并瓦片
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const { source } = this.options;
    const sourceCache = source.sourceCache;
    if (Array.isArray(sourceCache)) {
      if (sourceCache.length === 2) {
        this.renderTexture(this.#current, rendererParams, rendererState, sourceCache[0]);
        this.renderTexture(this.#next, rendererParams, rendererState, sourceCache[1]);
      } else {
        this.renderTexture(this.#current, rendererParams, rendererState, sourceCache[0]);
        this.renderTexture(this.#next, rendererParams, rendererState, sourceCache[0]);
      }
    } else {
      this.renderTexture(this.#current, rendererParams, rendererState, sourceCache);
      this.renderTexture(this.#next, rendererParams, rendererState, sourceCache);
    }
  }

  destroy() {
    if (this.#program) {
      this.#program.destroy();
      this.#program = null;
    }

    if (this.#current) {
      this.#current.destroy();
      this.#current = null;
    }

    if (this.#next) {
      this.#next.destroy();
      this.#next = null;
    }
  }
}

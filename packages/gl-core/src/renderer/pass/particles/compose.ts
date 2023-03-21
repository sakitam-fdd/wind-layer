import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/common.vert.glsl';
import frag from '../../../shaders/compose.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { RenderFrom, BandType } from '../../../type';
import { containsXY, littleEndian } from '../../../utils/common';
import TileID from '../../../tile/TileID';
import { SourceType } from '../../../source';

export interface ParticlesComposePassOptions {
  source: SourceType;
  bandType: BandType;
  renderFrom: RenderFrom;
  stencilConfigForOverlap: (tiles: any[]) => [{ [_: number]: any }, TileID[]];
}

const defaultSize = 256;

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边效果
 * 在下一步再进行完整的着色
 */
export default class ParticlesComposePass extends Pass<ParticlesComposePassOptions> {
  readonly #program: Program;

  readonly prerender = true;

  #current: RenderTarget;
  #next: RenderTarget;

  #width = defaultSize;
  #height = defaultSize;

  constructor(
    id: string,
    renderer: Renderer,
    options: ParticlesComposePassOptions = {} as ParticlesComposePassOptions,
  ) {
    super(id, renderer, options);

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
      this.#current.resize(width, height);
      this.#next.resize(width, height);
      this.#width = width;
      this.#height = height;
    }
  }

  get textures() {
    return {
      current: this.#current.texture,
      next: this.#next.texture,
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
    let zmax = -Infinity;
    // 1. 计算mapbox墨卡托坐标的最大最小值，构建真实瓦片范围
    for (let n = 0; n < coordsDescending.length; n++) {
      const tileId = coordsDescending[n];
      const bounds = tileId.getTileBounds();
      xmin = Math.min(bounds.left, xmin);
      xmax = Math.max(bounds.right, xmax);
      ymin = Math.min(bounds.top, ymin);
      ymax = Math.max(bounds.bottom, ymax);
      zmax = Math.max(tileId.z, zmax);
    }

    const zz = 1 / Math.pow(2, zmax);

    const dx = xmax - xmin;
    const dy = ymax - ymin;

    // 2. 计算 x 方向和 y 方向的行列数
    const w = dx / zz;
    const h = dy / zz;

    // 更新采样范围
    rendererState.u_bbox = [
      (rendererState.extent[0] - xmin) / dx,
      (rendererState.extent[1] - ymin) / dy,
      (rendererState.extent[2] - xmin) / dx,
      (rendererState.extent[3] - ymin) / dy,
    ];

    if (renderTarget) {
      renderTarget.clear();
      renderTarget.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && renderTarget.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }

      // 3. 计算出 fbo 所需大小
      const width = w * (this.options.source.tileSize ?? defaultSize);
      const height = h * (this.options.source.tileSize ?? defaultSize);

      this.resize(width, height);

      this.renderer.setViewport(width, height);
    }

    const [stencilModes, coords] = stencilConfigForOverlap(coordsDescending);

    // 4. 根据 y 方向递增和 x 方向递增，依次循环找出对应的瓦片
    for (let j = ymin; j < ymax; j += zz) {
      const y = j + zz / 2; // 防止越界
      for (let i = xmin; i < xmax; i += zz) {
        const x = i + zz / 2;
        const coord = coords.find((c) => {
          const tileBBox = c.getTileBounds();
          if (!tileBBox) return false;
          return containsXY([tileBBox.left, tileBBox.top, tileBBox.right, tileBBox.bottom], x, y);
        });

        // 5. 进行渲染
        if (coord) {
          const tile = sourceCache.getTile(coord);
          if (!(tile && tile.hasData())) continue;

          const tileBBox = coord.getTileBounds();
          if (!tileBBox) continue;

          const tileMesh = tile.createMesh(this.id, tileBBox, this.renderer, this.#program);
          const mesh = tileMesh.planeMesh;

          mesh.scale.set(1 / w, 1 / h, 1);
          mesh.position.set((tileBBox.left - xmin) / dx, (tileBBox.top - ymin) / dy, 0);

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
}

import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from './base';
import vert from '../../shaders/compose.vert.glsl';
import frag from '../../shaders/compose.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import TileManager from '../../layer/tile/TileManager';
import { RenderFrom, RenderType, TileState } from '../../type';
import { littleEndian } from '../../utils/common';
import Tile from '../../layer/tile/Tile';

export interface ComposePassOptions {
  tileManager: TileManager;
  renderType: RenderType;
  renderFrom: RenderFrom;
}

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边效果
 * 在下一步再进行完整的着色
 */
export default class ComposePass extends Pass<ComposePassOptions> {
  readonly #program: Program;

  readonly prerender = true;

  #current: RenderTarget;
  #next: RenderTarget;

  #nextStencilID: number;

  constructor(
    id: string,
    renderer: Renderer,
    options: ComposePassOptions = {} as ComposePassOptions,
  ) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        texture: {
          value: undefined,
        },
        dataRange: {
          value: undefined,
        },
      },
      defines: [`RENDER_TYPE ${this.options.renderType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
    });

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
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
    this.#current.resize(width, height);
    this.#next.resize(width, height);
  }

  get textures() {
    return {
      current: this.#current.texture,
      next: this.#next.texture,
    };
  }

  #clearStencil() {
    this.#nextStencilID = 1;
  }

  #stencilConfigForOverlap(tiles: any[]): [{ [_: number]: any }, Tile[]] {
    const coords = tiles.sort((a, b) => b.z - a.z);
    const minTileZ = coords[coords.length - 1].z;
    const stencilValues = coords[0].z - minTileZ + 1;
    if (stencilValues > 1) {
      if (this.#nextStencilID + stencilValues > 256) {
        this.#clearStencil();
      }
      const zToStencilMode = {};
      for (let i = 0; i < stencilValues; i++) {
        zToStencilMode[i + minTileZ] = {
          stencil: true,
          mask: 0xff,
          func: {
            cmp: this.renderer.gl.GEQUAL,
            ref: i + this.#nextStencilID,
            mask: 0xff,
          },
          op: {
            fail: this.renderer.gl.KEEP,
            zfail: this.renderer.gl.KEEP,
            zpass: this.renderer.gl.REPLACE,
          },
        };
      }
      this.#nextStencilID += stencilValues;
      return [zToStencilMode, coords];
    }
    return [
      {
        [minTileZ]: {
          stencil: false,
          mask: 0,
          func: {
            cmp: this.renderer.gl.ALWAYS,
            ref: 0,
            mask: 0,
          },
          op: {
            fail: this.renderer.gl.KEEP,
            zfail: this.renderer.gl.KEEP,
            zpass: this.renderer.gl.KEEP,
          },
        },
      },
      coords,
    ];
  }

  /**
   * 此处绘制主要是合并瓦片
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    if (this.#current) {
      this.#current.clear();
      this.#current.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && this.#current.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }
      this.renderer.setViewport(this.#current.width, this.#current.height);
    }

    const { tileManager } = this.options;

    this.#clearStencil();

    if (tileManager) {
      const tiles = tileManager.tiles;
      const tilesArray: Tile[] = [];
      const entries = tiles.entries();

      for (let i = 0; i < tiles.size; i++) {
        const [, tile] = entries.next().value;
        tilesArray.push(tile);
      }

      const [stencilModes, tls] = this.#stencilConfigForOverlap(tilesArray);

      for (let i = 0; i < tls.length; i++) {
        const tile = tls[i];
        if (tile && tile.state === TileState.loaded) {
          const tileMesh = tile.createMesh(this.#program);
          const mesh = tileMesh.getMesh();

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
          mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);

          const stencilMode = stencilModes[tile.z];

          if (stencilMode) {
            if (stencilMode.stencil) {
              console.log(stencilMode);
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
            camera: rendererParams.cameras.camera,
          });
        }
      }
    }

    if (this.#current) {
      this.#current.unbind();
    }
  }
}

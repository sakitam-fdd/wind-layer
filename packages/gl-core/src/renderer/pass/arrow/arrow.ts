import {
  Program,
  Renderer,
  Mesh,
  Geometry,
  Texture,
  utils,
  Vector2,
} from '@sakitam-gis/vis-engine';
import LRUCache from '../../../utils/LRUCache';
import Pass from '../base';
import { littleEndian } from '../../../utils/common';
import vert from '../../../shaders/arrow.vert.glsl';
import frag from '../../../shaders/arraw.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { BandType } from '../../../type';
import { SourceType } from '../../../source';
import TileID from '../../../tile/TileID';
import MaskPass from '../mask';

export interface ArrowPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  bandType: BandType;
  getPixelsToUnits: () => [number, number];
  getGridTiles: (tileSize: number) => TileID[];
  maskPass?: MaskPass;
}

const TILE_EXTENT = 4096.0;

/**
 * arrow
 */
export default class ArrowPass extends Pass<ArrowPassOptions> {
  #mesh: WithNull<Mesh>;
  #program: WithNull<Program>;
  #geometry: WithNull<Geometry>;
  #vertexArray: Float32Array;
  #lastTileSize: number;
  #lastSpace: number;

  #cache: LRUCache<TileID>;

  readonly prerender = false;

  constructor(id: string, renderer: Renderer, options: ArrowPassOptions = {} as ArrowPassOptions) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        opacity: {
          value: 1,
        },
        u_fade_t: {
          value: 0,
        },
        displayRange: {
          value: new Vector2(-Infinity, Infinity),
        },
        u_texture: {
          value: this.options.texture,
        },
        u_textureNext: {
          value: this.options.textureNext,
        },
        colorRampTexture: {
          value: null,
        },
      },
      defines: [`RENDER_TYPE ${this.options.bandType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
      transparent: true,
    });

    this.#mesh = new Mesh(this.renderer, {
      mode: this.renderer.gl.TRIANGLES,
      program: this.#program,
      geometry: new Geometry(this.renderer, {
        index: {
          size: 1,
          // data: new Uint16Array([0, 1, 2, 2, 1, 3]),
          data: new Uint16Array([0, 1, 2, 0, 2, 3]),
        },
        position: {
          size: 2,
          // data: new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
          data: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]),
        },
        uv: {
          size: 2,
          data: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]),
        },
        coords: {
          divisor: 1,
          data: new Float32Array(2),
          offset: 0,
          size: 2,
          stride: 8,
        },
      }),
    });

    this.#cache = new LRUCache(128, (t) => {
      if (t && t.dep && t.dep.geometry) {
        t.dep.geometry.destroy();
        t.dep = null;
      }
    });
  }

  createTileVertexArray(tileSize: number, space = 20) {
    if (!this.#vertexArray || tileSize !== this.#lastTileSize || space !== this.#lastSpace) {
      this.#lastTileSize = tileSize;
      this.#lastSpace = space;
      const column = Math.round(tileSize / space);

      const columnUnit = 1 / column;

      const halfUnit = columnUnit / 2;
      const points: any[] = [];

      for (let j = 0; j < column; j++) {
        for (let i = 0; i < column; i++) {
          points.push({
            x: TILE_EXTENT * (halfUnit + i * columnUnit),
            y: TILE_EXTENT * (halfUnit + j * columnUnit),
          });
        }
      }

      this.#vertexArray = new Float32Array(points.length * 2);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const pos = {
          x: Math.round(point.x),
          y: Math.round(point.y),
        };
        if (pos.x < 0 || pos.x >= TILE_EXTENT || pos.y < 0 || pos.y >= TILE_EXTENT) continue;
        this.#vertexArray[2 * i] = pos.x / TILE_EXTENT;
        this.#vertexArray[2 * i + 1] = pos.y / TILE_EXTENT;
      }
    }

    return this.#vertexArray;
  }

  /**
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const attr = this.renderer.attributes;
    this.renderer.setViewport(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    const camera = rendererParams.cameras.camera;
    const tileSize = this.options.source.tileSize ?? 256;
    const tiles = this.options.getGridTiles(tileSize);

    let stencil;

    if (this.maskPass) {
      stencil = this.maskPass.render(rendererParams, rendererState);
    }

    if (rendererState && this.#mesh && tiles && tiles.length > 0) {
      const uniforms = utils.pick(rendererState, [
        'opacity',
        'colorRange',
        'dataRange',
        'colorRampTexture',
        'useDisplayRange',
        'displayRange',
      ]);

      const zoom = rendererState.zoom;
      const dataBounds = rendererState.sharedState.u_data_bbox;
      const position = this.createTileVertexArray(tileSize, rendererState.symbolSpace);
      const pos = new Float32Array(position.length);
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const bounds = tile.getTileProjBounds();

        if (!this.#cache.has(tile.tileKey)) {
          for (let j = 0; j < position.length; j += 2) {
            pos[j] = bounds.left + position[j] * (bounds.right - bounds.left);
            pos[j + 1] = bounds.top + position[j + 1] * (bounds.bottom - bounds.top);
          }

          const geometry = new Geometry(this.renderer, {
            index: {
              size: 1,
              // data: new Uint16Array([0, 1, 2, 2, 1, 3]),
              data: new Uint16Array([0, 1, 2, 0, 2, 3]),
            },
            position: {
              size: 2,
              // data: new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
              data: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]),
            },
            uv: {
              size: 2,
              data: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]),
            },
            coords: {
              divisor: 1,
              data: pos,
              offset: 0,
              size: 2,
              stride: 8,
            },
          });

          this.#mesh.updateGeometry(geometry, false);

          tile.dep = { geometry };

          this.#cache.add(tile.tileKey, tile);
        } else {
          const t = this.#cache.get(tile.tileKey);
          this.#mesh.updateGeometry(t.dep.geometry, false);
        }

        const scaleFactor = Math.pow(2, zoom - tile.overscaledZ);

        const max = Math.max(bounds.right - bounds.left, bounds.bottom - bounds.top);
        const scale = 1 / max;

        const pixelToUnits = 1 / (tileSize * scaleFactor) / scale;

        Object.keys(uniforms).forEach((key) => {
          if (uniforms[key] !== undefined) {
            this.#mesh?.program.setUniform(key, uniforms[key]);
          }
        });

        const fade = this.options.source?.getFadeTime?.() || 0;
        this.#mesh.program.setUniform(
          'u_image_res',
          new Vector2(this.options.texture.width, this.options.texture.height),
        );
        this.#mesh.program.setUniform('u_fade_t', fade);
        this.#mesh.program.setUniform('arrowSize', rendererState.symbolSize);
        this.#mesh.program.setUniform('pixelsToProjUnit', new Vector2(pixelToUnits, pixelToUnits));
        this.#mesh.program.setUniform('u_bbox', rendererState.extent);
        this.#mesh.program.setUniform('u_data_bbox', dataBounds);
        this.#mesh.program.setUniform('u_head', 0.1);
        this.#mesh.program.setUniform('u_devicePixelRatio', attr.dpr);
        this.#mesh.program.setUniform('u_texture', this.options.texture);
        this.#mesh.program.setUniform('u_textureNext', this.options.textureNext);

        this.#mesh.updateMatrix();
        this.#mesh.worldMatrixNeedsUpdate = false;
        this.#mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, this.#mesh.localMatrix);
        this.#mesh.draw({
          ...rendererParams,
          camera,
        });
      }
    }

    if (!stencil) {
      this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
    }
  }

  destroy() {
    if (this.#mesh) {
      this.#mesh.destroy();
      this.#mesh = null;
    }

    if (this.#program) {
      this.#program.destroy();
      this.#program = null;
    }

    if (this.#geometry) {
      this.#geometry.destroy();
      this.#geometry = null;
    }

    this.#cache.clear();
  }
}

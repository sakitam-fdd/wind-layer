import {
  Program,
  Renderer,
  Mesh,
  Geometry,
  Texture,
  utils,
  Vector2,
} from '@sakitam-gis/vis-engine';
import Pass from '../base';
import { littleEndian } from '../../../utils/common';
import vert from '../../../shaders/arrow.vert.glsl';
import frag from '../../../shaders/arraw.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { BandType } from '../../../type';
import { SourceType } from '../../../source';
import TileID from '../../../tile/TileID';

export interface ArrowPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  bandType: BandType;
  getPixelsToUnits: () => [number, number];
  getGridTiles: (tileSize: number) => TileID[];
}

const TILE_EXTENT = 4096.0;

/**
 * arrow
 */
export default class ArrowPass extends Pass<ArrowPassOptions> {
  #program: WithNull<Program>;
  #geometry: WithNull<Geometry>;

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
  }

  createTileVertexArray() {
    const space = 20;
    const tileSize = 512;
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

    const positions = new Float32Array(points.length * 2);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const pos = {
        x: Math.round(point.x),
        y: Math.round(point.y),
      };
      if (pos.x < 0 || pos.x >= TILE_EXTENT || pos.y < 0 || pos.y >= TILE_EXTENT) continue;
      positions[2 * i] = pos.x / TILE_EXTENT;
      positions[2 * i + 1] = pos.y / TILE_EXTENT;
    }

    return positions;
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

    // export default function(tile: interface {tileID: OverscaledTileID, tileSize: number}, pixelValue: number, z: number): number {
    //   return pixelValue * (EXTENT / (tile.tileSize * Math.pow(2, z - tile.tileID.overscaledZ)));
    // }
    //
    // scaleFactor
    //
    // function getPixelsToTileUnitsMatrix(tile: interface {tileID: OverscaledTileID, tileSize: number, +tileTransform: TileTransform}, transform: Transform): Float32Array {
    //   const {scale} = tile.tileTransform;
    //   const s = scale * EXTENT / (tile.tileSize * Math.pow(2, transform.zoom - tile.tileID.overscaledZ + tile.tileID.canonical.z));
    //   return mat2.scale(new Float32Array(4), transform.inverseAdjustmentMatrix, [s, s]);
    // }

    if (rendererState && this.#program && tiles && tiles.length > 0) {
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
      // const pixelsToUnits = this.options.getPixelsToUnits();

      if (!this.#geometry) {
        this.#geometry = new Geometry(this.renderer, {
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
            data: this.createTileVertexArray(),
            offset: 0,
            size: 2,
            stride: 8,
          },
        });
      }

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const scaleFactor = Math.pow(2, zoom - tile.overscaledZ);

        const pixelToUnits = 1 / (tileSize * scaleFactor);

        const mesh = new Mesh(this.renderer, {
          mode: this.renderer.gl.TRIANGLES,
          program: this.#program!,
          geometry: this.#geometry!,
        });

        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);

        Object.keys(uniforms).forEach((key) => {
          if (uniforms[key] !== undefined) {
            mesh?.program.setUniform(key, uniforms[key]);
          }
        });

        const fade = this.options.source?.getFadeTime?.() || 0;
        mesh.program.setUniform(
          'u_image_res',
          new Vector2(this.options.texture.width, this.options.texture.height),
        );
        mesh.program.setUniform('u_fade_t', fade);
        mesh.program.setUniform('arrowSize', rendererState.symbolSize);
        mesh.program.setUniform('pixelsToProjUnit', new Vector2(pixelToUnits, pixelToUnits));
        mesh.program.setUniform('u_bbox', rendererState.extent);
        mesh.program.setUniform('u_data_bbox', dataBounds);
        mesh.program.setUniform('u_head', 0.1);

        mesh.updateMatrix();
        mesh.worldMatrixNeedsUpdate = false;
        mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);
        mesh.draw({
          ...rendererParams,
          camera,
        });
      }
    }
  }

  destroy() {
    if (this.#program) {
      this.#program.destroy();
      this.#program = null;
    }

    if (this.#geometry) {
      this.#geometry.destroy();
      this.#geometry = null;
    }
  }
}

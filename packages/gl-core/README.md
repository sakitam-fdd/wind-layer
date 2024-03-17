# `wind-gl-core`

> wind-gl-core core

## Usage

```ts
import { OrthographicCamera, Renderer, Scene, utils } from '@sakitam-gis/vis-engine';

import type { UserOptions, SourceType } from 'wind-gl-core';
import { BaseLayer, LayerSourceType, RenderType, TileID, polygon2buffer } from 'wind-gl-core';

this.renderer = new Renderer(gl, {
  autoClear: false,
  extensions: [
    'OES_texture_float',
    'OES_texture_float_linear',
    'WEBGL_color_buffer_float',
    'EXT_color_buffer_float',
  ],
});

this.scene = new Scene();
this.sync = new CameraSync(this.map, 'perspective', this.scene);
this.planeCamera = new OrthographicCamera(0, 1, 1, 0, 0, 1);

this.layer = new BaseLayer(
  this.source,
  {
    renderer: this.renderer,
    scene: this.scene,
  },
  {
    renderType: this.options.renderType,
    renderFrom: this.options.renderFrom,
    styleSpec: this.options.styleSpec,
    displayRange: this.options.displayRange,
    widthSegments: this.options.widthSegments,
    heightSegments: this.options.heightSegments,
    wireframe: this.options.wireframe,
    picking: this.options.picking,
    mask: this.processMask(),
    getZoom: () => this.map?.getZoom() as number,
    triggerRepaint: () => {
      this.map?.triggerRepaint();
    },
    getTileProjSize: (z: number) => {
      const w = 1 / Math.pow(2, z);
      return [w, w];
    },
    getPixelsToUnits: (): [number, number] => {
      const pixel = 1;
      const y = canvas.clientHeight / 2 - pixel / 2;
      const x = canvas.clientWidth / 2 - pixel / 2;
      const left = mapboxgl.MercatorCoordinate.fromLngLat(m.unproject([x, y]));
      const right = mapboxgl.MercatorCoordinate.fromLngLat(m.unproject([x + pixel, y + pixel]));

      return [Math.abs(right.x - left.x), Math.abs(left.y - right.y)];
    },
    getPixelsToProjUnit: () => [
      (this.map as any)?.transform.pixelsPerMeter,
      (this.map as any)?.transform.pixelsPerMeter,
    ],
    getViewTiles: (source: SourceType, renderType: RenderType) => {
      let { type } = source;
      // @ts-ignore
      type = type !== LayerSourceType.timeline ? type : source.privateType;
      const map = this.map as any;
      if (!map) return [];
      const { transform } = map;
      const wrapTiles: TileID[] = [];
      if (type === LayerSourceType.image) {
        // @ts-ignore
        const cornerCoords = source.coordinates.map((c: any) =>
          mapboxgl.MercatorCoordinate.fromLngLat(c),
        );
        const tileID = getCoordinatesCenterTileID(cornerCoords);
        if (source.wrapX) {
          transform.getVisibleUnwrappedCoordinates(tileID).forEach((unwrapped) => {
            const { canonical, wrap } = unwrapped;
            const { x, y, z } = canonical;
            wrapTiles.push(
              new TileID(z, wrap, z, x, y, {
                getTileBounds: () => [
                  (source as any).coordinates[0][0],
                  (source as any).coordinates[2][1],
                  (source as any).coordinates[1][0],
                  (source as any).coordinates[0][1],
                ],
                getTileProjBounds: () => ({
                  left: tileID.extent[0] + wrap,
                  top: tileID.extent[1],
                  right: tileID.extent[2] + wrap,
                  bottom: tileID.extent[3],
                }),
              }),
            );
          });
        } else {
          const x = tileID.x;
          const y = tileID.y;
          const z = tileID.z;
          const wrap = 0;
          wrapTiles.push(
            new TileID(z, wrap, z, x, y, {
              getTileBounds: () => [
                (source as any).coordinates[0][0],
                (source as any).coordinates[2][1],
                (source as any).coordinates[1][0],
                (source as any).coordinates[0][1],
              ],
              getTileProjBounds: () => ({
                left: tileID.extent[0] + wrap,
                top: tileID.extent[1],
                right: tileID.extent[2] + wrap,
                bottom: tileID.extent[3],
              }),
            }),
          );
        }
      } else if (type === LayerSourceType.tile) {
        const opts = {
          tileSize: utils.isNumber(this.source.tileSize)
            ? source.tileSize
            : source.tileSize?.[0] || 512,
          // for mapbox
          minzoom: source.minZoom,
          maxzoom: source.maxZoom,
          roundZoom: source.roundZoom,
        };

        // eslint-disable-next-line no-empty
        const tiles = transform.coveringTiles(opts);

        for (let i = 0; i < tiles.length; i++) {
          const tile = tiles[i];
          const { canonical, wrap } = tile;
          const { x, y, z } = canonical;
          if (source.wrapX) {
            wrapTiles.push(
              new TileID(z, wrap, z, x, y, {
                getTileBounds,
                getTileProjBounds,
              }),
            );
          } else if (tile.wrap === 0) {
            wrapTiles.push(
              new TileID(z, wrap, z, x, y, {
                getTileBounds,
                getTileProjBounds,
              }),
            );
          }
        }

        // 针对粒子图层，需要补齐所需瓦片，避免采样出现问题
        if (renderType === RenderType.particles) {
          wrapTiles.push(...expandTiles(wrapTiles));
        }
      }

      return wrapTiles;
    },
    getExtent: () => {
      const map = this.map as any;
      const bounds: any = map?.getBounds().toArray();

      const xmin = bounds[0][0];
      const ymin = bounds[0][1];
      const xmax = bounds[1][0];
      const ymax = bounds[1][1];
      const minY = Math.max(
        ymin,
        map.transform.latRange ? map.transform.latRange[0] : map.transform.minLat,
      );
      const maxY = Math.min(
        ymax,
        map.transform.latRange ? map.transform.latRange[1] : map.transform.maxLat,
      );
      const p0 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmin, maxY));
      const p1 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmax, minY));
      return [p0.x, p0.y, p1.x, p1.y];
    },
    getGridTiles: (source: any) => {
      const tileSize = source.tileSize;
      const wrapX = source.wrapX;
      const map = this.map as any;
      if (!map) return [];
      const { transform } = map;

      const opts = {
        tileSize: tileSize ?? 256,
        minzoom: map.getMinZoom(),
        maxzoom: map.getMaxZoom(),
        roundZoom: false,
      };

      const tiles = transform.coveringTiles(opts);
      const wrapTiles: TileID[] = [];

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const { canonical, wrap } = tile;
        const { x, y, z } = canonical;
        if (wrapX) {
          wrapTiles.push(
            new TileID(z, wrap, z, x, y, {
              getTileBounds,
              getTileProjBounds,
            }),
          );
        } else if (tile.wrap === 0) {
          wrapTiles.push(
            new TileID(z, wrap, z, x, y, {
              getTileBounds,
              getTileProjBounds,
            }),
          );
        }
      }

      return wrapTiles;
    },
  },
);
```

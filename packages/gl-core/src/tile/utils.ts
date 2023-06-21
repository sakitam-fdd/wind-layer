export type ZRange = [minZ: number, maxZ: number];

export type Bounds = [minX: number, minY: number, maxX: number, maxY: number];

export type GeoBoundingBox = { west: number; north: number; east: number; south: number };
export type NonGeoBoundingBox = { left: number; top: number; right: number; bottom: number };

export type TileBoundingBox = NonGeoBoundingBox | GeoBoundingBox;

export type TileIndex = { x: number; y: number; z: number };

export type TileLoadProps = {
  index: TileIndex;
  id: string;
  bbox: TileBoundingBox;
  url?: string | null;
  signal?: AbortSignal;
  userData?: Record<string, any>;
  zoom?: number;
};

const TILE_SIZE = 512;
// number of world copies to check
const MAX_MAPS = 3;
const PI = Math.PI;
const PI_4 = PI / 4;
const DEGREES_TO_RADIANS = PI / 180;
const RADIANS_TO_DEGREES = 180 / PI;
const DEFAULT_EXTENT: Bounds = [-Infinity, -Infinity, Infinity, Infinity];

type Viewport = any;
type Matrix4 = any;

class OSMNode {
  x: number;
  y: number;
  z: number;

  private childVisible?: boolean;
  private selected?: boolean;

  private _children?: OSMNode[];

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get children() {
    if (!this._children) {
      const x = this.x * 2;
      const y = this.y * 2;
      const z = this.z + 1;
      this._children = [
        new OSMNode(x, y, z),
        new OSMNode(x, y + 1, z),
        new OSMNode(x + 1, y, z),
        new OSMNode(x + 1, y + 1, z)
      ];
    }
    return this._children;
  }

  // eslint-disable-next-line complexity
  update(params: {
    viewport: Viewport;
    minZ: number;
    maxZ: number;
    bounds?: Bounds;
    offset: number;
  }) {
    const {viewport, minZ, maxZ, bounds} = params;

    // First, check if this tile is visible
    if (bounds && !this.insideBounds(bounds)) {
      return false;
    }

    // Avoid loading overlapping tiles - if a descendant is requested, do not request the ancester
    if (!this.childVisible) {
      let {z} = this;
      if (z < maxZ && z >= minZ) {
        // Adjust LOD
        // If the tile is far enough from the camera, accept a lower zoom level
        const distance =
          (boundingVolume.distanceTo(viewport.cameraPosition) * viewport.scale) / viewport.height;
        z += Math.floor(Math.log2(distance));
      }
      if (z >= maxZ) {
        // LOD is acceptable
        this.selected = true;
        return true;
      }
    }

    // LOD is not enough, recursively test child tiles
    this.selected = false;
    this.childVisible = true;
    for (const child of this.children) {
      child.update(params);
    }
    return true;
  }

  getSelected(result: OSMNode[] = []): OSMNode[] {
    if (this.selected) {
      result.push(this);
    }
    if (this._children) {
      for (const node of this._children) {
        node.getSelected(result);
      }
    }
    return result;
  }

  insideBounds([minX, minY, maxX, maxY]: Bounds): boolean {
    const scale = Math.pow(2, this.z);
    const extent = TILE_SIZE / scale;

    return (
      this.x * extent < maxX &&
      this.y * extent < maxY &&
      (this.x + 1) * extent > minX &&
      (this.y + 1) * extent > minY
    );
  }
}

export function lngLatToWorld(lngLat: number[]): [number, number] {
  const [lng, lat] = lngLat;

  const lambda2 = lng * DEGREES_TO_RADIANS;
  const phi2 = lat * DEGREES_TO_RADIANS;
  const x = (TILE_SIZE * (lambda2 + PI)) / (2 * PI);
  const y = (TILE_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5)))) / (2 * PI);
  return [x, y];
}

export function worldToLngLat(xy: number[]): [number, number] {
  const [x, y] = xy;
  const lambda2 = (x / TILE_SIZE) * (2 * PI) - PI;
  const phi2 = 2 * (Math.atan(Math.exp((y / TILE_SIZE) * (2 * PI) - PI)) - PI_4);
  return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
}

// eslint-disable-next-line complexity
export function getOSMTileIndices(
  viewport: Viewport,
  maxZ: number,
  zRange?: ZRange | null,
  bounds?: Bounds,
): TileIndex[] {
  // Always load at the current zoom level if pitch is small
  const minZ = viewport instanceof WebMercatorViewport && viewport.pitch <= 60 ? maxZ : 0;

  // Map extent to OSM position
  if (bounds) {
    const [minLng, minLat, maxLng, maxLat] = bounds;
    const topLeft = lngLatToWorld([minLng, maxLat]);
    const bottomRight = lngLatToWorld([maxLng, minLat]);
    bounds = [topLeft[0], TILE_SIZE - topLeft[1], bottomRight[0], TILE_SIZE - bottomRight[1]];
  }

  const root = new OSMNode(0, 0, 0);
  const traversalParams = {
    viewport,
    minZ,
    maxZ,
    bounds,
    // num. of worlds from the center. For repeated maps
    offset: 0,
  };

  root.update(traversalParams);

  if (
    viewport instanceof WebMercatorViewport &&
    viewport.subViewports &&
    viewport.subViewports.length > 1
  ) {
    // Check worlds in repeated maps
    traversalParams.offset = -1;
    while (root.update(traversalParams)) {
      if (--traversalParams.offset < -MAX_MAPS) {
        break;
      }
    }
    traversalParams.offset = 1;
    while (root.update(traversalParams)) {
      if (++traversalParams.offset > MAX_MAPS) {
        break;
      }
    }
  }

  return root.getSelected();
}

function transformBox(bbox: Bounds, modelMatrix: Matrix4): Bounds {
  const transformedCoords = [
    // top-left
    modelMatrix.transformAsPoint([bbox[0], bbox[1]]),
    // top-right
    modelMatrix.transformAsPoint([bbox[2], bbox[1]]),
    // bottom-left
    modelMatrix.transformAsPoint([bbox[0], bbox[3]]),
    // bottom-right
    modelMatrix.transformAsPoint([bbox[2], bbox[3]]),
  ];
  const transformedBox: Bounds = [
    // Minimum x coord
    Math.min(...transformedCoords.map((i) => i[0])),
    // Minimum y coord
    Math.min(...transformedCoords.map((i) => i[1])),
    // Max x coord
    Math.max(...transformedCoords.map((i) => i[0])),
    // Max y coord
    Math.max(...transformedCoords.map((i) => i[1])),
  ];
  return transformedBox;
}

/**
 * gets the bounding box of a viewport
 */
function getBoundingBox(viewport: Viewport, zRange: number[] | null, extent: Bounds): Bounds {
  let bounds;
  if (zRange && zRange.length === 2) {
    const [minZ, maxZ] = zRange;
    const bounds0 = viewport.getBounds({ z: minZ });
    const bounds1 = viewport.getBounds({ z: maxZ });
    bounds = [
      Math.min(bounds0[0], bounds1[0]),
      Math.min(bounds0[1], bounds1[1]),
      Math.max(bounds0[2], bounds1[2]),
      Math.max(bounds0[3], bounds1[3]),
    ];
  } else {
    bounds = viewport.getBounds();
  }

  return [
    Math.max(bounds[0], extent[0]),
    Math.max(bounds[1], extent[1]),
    Math.min(bounds[2], extent[2]),
    Math.min(bounds[3], extent[3]),
  ];
}

function getCullBoundsInViewport(
  /** Current viewport */
  viewport: Viewport,
  /** At altitude */
  z: ZRange | number,
  /** Culling rectangle in screen space */
  cullRect: { x: number; y: number; width: number; height: number },
): [number, number, number, number] {
  if (!Array.isArray(z)) {
    const x = cullRect.x - viewport.x;
    const y = cullRect.y - viewport.y;
    const { width, height } = cullRect;

    const unprojectOption = { targetZ: z };

    const topLeft = viewport.unproject([x, y], unprojectOption);
    const topRight = viewport.unproject([x + width, y], unprojectOption);
    const bottomLeft = viewport.unproject([x, y + height], unprojectOption);
    const bottomRight = viewport.unproject([x + width, y + height], unprojectOption);

    return [
      Math.min(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]),
      Math.min(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]),
      Math.max(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]),
      Math.max(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]),
    ];
  }

  const bounds0 = getCullBoundsInViewport(viewport, z[0], cullRect);
  const bounds1 = getCullBoundsInViewport(viewport, z[1], cullRect);

  return [
    Math.min(bounds0[0], bounds1[0]),
    Math.min(bounds0[1], bounds1[1]),
    Math.max(bounds0[2], bounds1[2]),
    Math.max(bounds0[3], bounds1[3]),
  ];
}

/** Get culling bounds in world space */
export function getCullBounds({
  viewport,
  z,
  cullRect,
}: {
  /** Current viewport */
  viewport: Viewport;
  /** Current z range */
  z?: ZRange | number | null;
  /** Culling rectangle in screen space */
  cullRect: { x: number; y: number; width: number; height: number };
}): [number, number, number, number][] {
  const subViewports = viewport.subViewports || [viewport];
  return subViewports.map((v) => getCullBoundsInViewport(v, z || 0, cullRect));
}

function getIndexingCoords(bbox: Bounds, scale: number, modelMatrixInverse?: Matrix4): Bounds {
  if (modelMatrixInverse) {
    const transformedTileIndex = transformBox(bbox, modelMatrixInverse).map(
      (i) => (i * scale) / TILE_SIZE,
    );
    return transformedTileIndex as Bounds;
  }
  return bbox.map((i) => (i * scale) / TILE_SIZE) as Bounds;
}

function getScale(z: number, tileSize: number): number {
  return (Math.pow(2, z) * TILE_SIZE) / tileSize;
}

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers_2
export function osmTile2lngLat(x: number, y: number, z: number): [number, number] {
  const scale = getScale(z, TILE_SIZE);
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
}

function tile2XY(x: number, y: number, z: number, tileSize: number): [number, number] {
  const scale = getScale(z, tileSize);
  return [(x / scale) * TILE_SIZE, (y / scale) * TILE_SIZE];
}

export function tileToBoundingBox(
  viewport: Viewport,
  x: number,
  y: number,
  z: number,
  tileSize: number = TILE_SIZE,
): TileBoundingBox {
  if (viewport.isGeospatial) {
    const [west, north] = osmTile2lngLat(x, y, z);
    const [east, south] = osmTile2lngLat(x + 1, y + 1, z);
    return { west, north, east, south };
  }
  const [left, top] = tile2XY(x, y, z, tileSize);
  const [right, bottom] = tile2XY(x + 1, y + 1, z, tileSize);
  return { left, top, right, bottom };
}

function getIdentityTileIndices(
  viewport: Viewport,
  z: number,
  tileSize: number,
  extent: Bounds,
  modelMatrixInverse?: Matrix4,
) {
  const bbox = getBoundingBox(viewport, null, extent);
  const scale = getScale(z, tileSize);
  const [minX, minY, maxX, maxY] = getIndexingCoords(bbox, scale, modelMatrixInverse);
  const indices: TileIndex[] = [];

  /*
      |  TILE  |  TILE  |  TILE  |
        |(minX)            |(maxX)
   */
  for (let x = Math.floor(minX); x < maxX; x++) {
    for (let y = Math.floor(minY); y < maxY; y++) {
      indices.push({ x, y, z });
    }
  }
  return indices;
}

/**
 * Returns all tile indices in the current viewport. If the current zoom level is smaller
 * than minZoom, return an empty array. If the current zoom level is greater than maxZoom,
 * return tiles that are on maxZoom.
 */
// eslint-disable-next-line complexity
export function getTileIndices({
  viewport,
  maxZoom,
  minZoom,
  zRange,
  extent,
  tileSize = TILE_SIZE,
  modelMatrix,
  modelMatrixInverse,
  zoomOffset = 0,
}: {
  viewport: Viewport;
  maxZoom?: number;
  minZoom?: number;
  zRange?: ZRange | null;
  extent?: Bounds;
  tileSize?: number;
  modelMatrix?: Matrix4;
  modelMatrixInverse?: Matrix4;
  zoomOffset?: number;
}) {
  let z = Math.round(viewport.zoom + Math.log2(TILE_SIZE / tileSize)) + zoomOffset;
  if (typeof minZoom === 'number' && Number.isFinite(minZoom) && z < minZoom) {
    if (!extent) {
      return [];
    }
    z = minZoom;
  }
  if (typeof maxZoom === 'number' && Number.isFinite(maxZoom) && z > maxZoom) {
    z = maxZoom;
  }

  return getOSMTileIndices(viewport, z, zRange, extent);
}

/**
 * Returns true if s is a valid URL template
 */
export function isURLTemplate(s: string): boolean {
  return /(?=.*{z})(?=.*{x})(?=.*({y}|{-y}))/.test(s);
}

export function isGeoBoundingBox(v: any): v is GeoBoundingBox {
  return (
    Number.isFinite(v.west) &&
    Number.isFinite(v.north) &&
    Number.isFinite(v.east) &&
    Number.isFinite(v.south)
  );
}

getTileIndices({
  viewport,
  maxZoom,
  minZoom,
  zRange,
  tileSize,
  extent: extent as Bounds | undefined,
  modelMatrix,
  modelMatrixInverse,
  zoomOffset,
});

// form: https://github.com/openlayers/openlayers/blob/master/src/ol/extent.js

export type Extent = [number, number, number, number];
export type Coordinates = [number, number];

export function containsCoordinate(extent: Extent, coordinate: Coordinates): boolean {
  const x = coordinate[0];
  const y = coordinate[1];
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3]
}

export function containsExtent(extent1: Extent, extent2: Extent): boolean {
  return (
    extent1[0] <= extent2[0] &&
    extent2[2] <= extent1[2] &&
    extent1[1] <= extent2[1] &&
    extent2[3] <= extent1[3]
  );
}

export function getWidth(extent: Extent): number {
  return extent[2] - extent[0];
}

// function calcWhichView(map: any) {
//   const projObject = map.getProjection().fullExtent;
//   const projectionExtent = [projObject.left, projObject.bottom, projObject.right, projObject.top] as Extent;
//   const projExtent = map.getProjExtent();
//   const extent = [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
//   let startX = extent[0];
//   const worldWidth = getWidth(projectionExtent);
//   let world = 0;
//   let offsetX;
//   while (startX < projectionExtent[0]) {
//     --world;
//     offsetX = worldWidth * world;
//     console.log('-', world);
//     startX += worldWidth;
//   }
//   world = 0;
//   startX = extent[2];
//   while (startX > projectionExtent[2]) {
//     ++world;
//     offsetX = worldWidth * world;
//     console.log('+', world);
//     startX -= worldWidth;
//   }
// }

export function transform(input: number[], opt_output: number[], opt_dimension: number): number[] {
  const length = input.length;
  const dimension = opt_dimension > 1 ? opt_dimension : 2;
  let output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    output[i] = (180 * input[i]) / 20037508.342789244;
    output[i + 1] =
      (360 * Math.atan(Math.exp(input[i + 1] / 6378137))) / Math.PI - 90;
  }
  return output;
}

export function createOrUpdate(minX: number, minY: number, maxX: number, maxY: number, opt_extent: Extent | undefined) {
  if (opt_extent) {
    opt_extent[0] = minX;
    opt_extent[1] = minY;
    opt_extent[2] = maxX;
    opt_extent[3] = maxY;
    return opt_extent;
  } else {
    return [minX, minY, maxX, maxY];
  }
}

export function boundingExtentXYs(xs: number[], ys: number[], opt_extent: Extent | undefined) {
  const minX = Math.min.apply(null, xs);
  const minY = Math.min.apply(null, ys);
  const maxX = Math.max.apply(null, xs);
  const maxY = Math.max.apply(null, ys);
  return createOrUpdate(minX, minY, maxX, maxY, opt_extent);
}

export function applyTransform(extent: Extent, transformFn: typeof transform, opt_extent: Extent | undefined, opt_stops: number) {
  let coordinates = [];
  if (opt_stops > 1) {
    const width = extent[2] - extent[0];
    const height = extent[3] - extent[1];
    for (let i = 0; i < opt_stops; ++i) {
      coordinates.push(
        extent[0] + (width * i) / opt_stops,
        extent[1],
        extent[2],
        extent[1] + (height * i) / opt_stops,
        extent[2] - (width * i) / opt_stops,
        extent[3],
        extent[0],
        extent[3] - (height * i) / opt_stops
      );
    }
  } else {
    coordinates = [
      extent[0],
      extent[1],
      extent[2],
      extent[1],
      extent[2],
      extent[3],
      extent[0],
      extent[3],
    ];
  }
  transformFn(coordinates, coordinates, 2);
  const xs = [];
  const ys = [];
  for (let i = 0, l = coordinates.length; i < l; i += 2) {
    xs.push(coordinates[i]);
    ys.push(coordinates[i + 1]);
  }
  return boundingExtentXYs(xs, ys, opt_extent);
}

export function transformExtent(extent: Extent, opt_stops: number) {
  return applyTransform(extent, transform, undefined, opt_stops);
}

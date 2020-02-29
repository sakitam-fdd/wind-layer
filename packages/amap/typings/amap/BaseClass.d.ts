declare namespace AMap{
  export class Pixel {
    constructor (x: number, y: number);
    getX(): number;
    getY(): number;
    equals(point: Pixel): boolean;
    toString(): string;
  }

  export class Size {
    constructor(width: number, height: number);
    getWidth(): number;
    getHeight(): number;
    toString(): string;
  }

  export class LngLat {
    constructor (lng: number, lat: number, noAutofix?: boolean);
    offset (w: number, s: number): LngLat;
    distance (lnglat: LngLat) : number;
    getLng(): number;
    getLat(): number;
    equals(lnglat: LngLat): boolean;
    toString(): string;
  }

  export class Bounds {
    constructor(southWest: LngLat, northEast: LngLat);
    contains(point: LngLat): boolean;
    getCenter(): LngLat;
    getSouthWest(): LngLat;
    getNorthEast(): LngLat;
    toString(): string;
  }
}

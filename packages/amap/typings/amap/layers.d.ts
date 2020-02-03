declare namespace AMap {
  export class TileLayer{
    constructor(tileOpt: TileLayerOptions)
    setOpacity(alpha: number): void;
    show(): void
    hide(): void;
    getTiles(): void;
    reload(): void;
    setTileUrl(): void;
    getZooms(): Array<number>
    setzIndex(index: number): void;
    setMap(map: Map): void;
  }
  export interface TileLayerOptions {
    map?: Map;
    tileSize?: number;
    tileUrl?: string;
    errorUrl?: string;
    getTileUrl?: string | Function;
    zIndex?: number;
    opacity?: number;
    zooms?: Array<number>;
    detectRetina?: boolean;
  }
}

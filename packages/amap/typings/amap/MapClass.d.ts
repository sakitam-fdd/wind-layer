/// <reference path="BaseClass.d.ts" />
/// <reference path="layers.d.ts" />

declare namespace AMap {
  export class Map {
    constructor(container: string | HTMLDivElement, opts: AMapMapOptions);
    poiOnAMAP(obj: Object): void;
    detailOnAMAP(obj: Object): void;
    getZoom(): number;
    getLayers(): Array<any>;
    getCenter(): LngLat;
    getContainer(): HTMLDivElement;
    getCity(callback: Function): {
      province: string,
      city: string,
      citycode: string,
      district: string
    };
    getBounds(): Bounds;
    getLabelzIndex(): number;
    getLimitBounds(): Bounds;
    getLang(): string;
    getSize(): Size;
    getRotation(): number;
    getStatus(): Object;
    getDefaultCursor(): string;
    // 获取指定位置的地图分辨率，单位：米/像素。
    getResolution(point: LngLat): number;
    // 获取当前地图比例尺
    getScale(dpi: number): number;
    setZoom(level: number): void;
    setlabelzIndex(index: number): void;
    setLayers(layer: Array<any>): void;
    add(overlayers: Array<any>): void;
    remove(overlayers: Array<any> | any): void;
    getAllOverlays(type: any): Object;
    setCenter(position: LngLat): void;
    setZoomAndCenter(zoomLevel: number,center:LngLat): void;
    setCity(city: string, callback: Function): void;
    setBounds(bounds: Bounds): void;
    setLimitBounds(bound:Bounds): void;
    clearLimitBounds(): void;
    setLang(lang: string): string;
    setRotation(rotation: number): void;
    setStatus(status: Object):void;
    setDefaultCursor(cursor: string): void;
    zoomIn(): void;
    zoomOut(): void;
    panTo(positon: LngLat): void;
    panBy(x: number,y: number): void;
    setFitView(overlayList: Array<any> | null, immediately: boolean, avoid:[number, number, number, number], maxZoom: number): void;
    clearMap(): void;
    destroy(): void;
    plugin(name: string | Array<any>, callback: Function): void;
    addControl(obj: Object): void;
    removeControl(): void;
    clearInfoWindow(): void;
    pixelToLngLat(pixel: Pixel, level: number): LngLat;
    lnglatToPixel(lngLat: LngLat, level: number): Pixel;
    containerToLngLat(pixel: Pixel): LngLat;
    lngLatToContainer(lnglat: LngLat): Pixel;
    setMapStyle(style: string): void;
    getMapStyle():  string;
    setFeatures(feature: Array<any>): void;
    getFeatures(): Array<any>;
    setDefaultLayer(layer: TileLayer): void;
    setPitch(number: number): void;
    getPitch(): number;
  }

  export interface AMapMapOptions {
    view?: View2D;
    // 地图图层数组，数组可以是图层 中的一个或多个，默认为普通二维地图。当叠加多个图层时，普通二维地图需通过实例化一个TileLayer类实现
    layers?: Array<any>;
    // 地图显示的缩放级别，若center与level未赋值，地图初始化默认显示用户所在城市范围3D地图下，zoom值，可以设置为浮点数。（在V1.3.0版本level参数调整为zoom，3D地图修改自V1.4.0开始生效）
    zoom?: number;
    // 地图中心点坐标值
    center?: LngLat;
    // 地图标注显示顺序，大于110即可将底图上的默认标注显示在覆盖物（圆、折线、面）之上。
    labelzIndex?: number;
    // 地图显示的缩放级别范围
    // 在PC上，默认为[3,18]，取值范围[3-18]；
    // 在移动设备上，默认为[3,19],取值范围[3-19]
    zooms?: Array<number>;
    // 地图语言类型
    // 可选值：zh_cn：中文简体，en：英文，zh_en：中英文对照
    // 默认为: zh_cn：中文简体
    // 注：由于图面内容限制，中文、英文 、中英文地图POI可能存在不一致的情况
    lang?: string;
    // 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
    defaultCursor?: string;
    // 地图显示的参考坐标系，取值：'EPSG3857''EPSG3395''EPSG4326'自V1.3.0移入view对象中
    crs?: string;
    // 地图平移过程中是否使用动画
    animateEnable?: boolean;
    // 是否开启地图热点和标注的hover效果。PC端默认是true，移动端默认是false
    isHotspot?: boolean;
    // 当前地图中默认显示的图层。默认图层可以是TileLayer.Satellite等切片地图，也可以是通过TileLayer自定义的切片图层
    defaultLayer?: TileLayer;
    // 地图是否可旋转，3D视图默认为true，2D视图默认false。
    rotateEnable?: boolean;
    // 是否监控地图容器尺寸变化，默认值为false
    resizeEnable?: boolean;
    // 是否在有矢量底图的时候自动展示室内地图，PC端默认是true，移动端默认是false
    showIndoorMap?: boolean;
    // 是否支持可以扩展最大缩放级别,和zooms属性配合使用
    expandZoomRange?: boolean;
    // 地图是否可通过鼠标拖拽平移，默认为true
    dragEnable?: boolean;
    // 地图是否可缩放，默认值为true。
    zoomEnable?: boolean;
    // 地图是否可通过双击鼠标放大地图，默认为true。
    doubleClickZoom?: boolean;
    // 地图是否可通过键盘控制,默认为true
    keyboardEnable?: boolean;
    // 地图是否使用缓动效果，默认值为true。
    jogEnable?: boolean;
    // 地图是否可通过鼠标滚轮缩放浏览，默认为true。
    scrollWheel?: boolean;
    // 地图在移动终端上是否可通过多点触控缩放浏览地图，默认为true。
    touchZoom?: boolean;
    // 可缺省，当touchZoomCenter=1的时候，手机端双指缩放的以地图中心为中心，否则默认以双指中间点为中心
    touchZoomCenter?: number;
    // 设置地图的显示样式
    mapStyle?: string;
    // 设置地图上显示的元素种类
    // 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
    features?: Array<string>;
    // 设置地图显示3D楼块效果，移动端也可使用。推荐使用。
    showBuildingBlock?: boolean;
    // 默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。（自V1.4.0开始支持）
    viewMode?: string;
    // 俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
    pitch?: number;
    // 是否允许设置俯仰角度，3D视图下为true，2D视图下无效。（自V1.4.0开始支持）
    pitchEnable?: boolean;
    // 楼块出现和消失的时候是否显示动画过程，3D视图有效，PC端默认true，手机端默认false。（自V1.4.0开始支持）
    buildingAnimation?: boolean;
    // 调整天空颜色，配合自定义地图，3D视图有效，如‘#ff0000’。（自V1.4.0开始支持）
    skyColor?: string;
    // 设置地图的预加载模式，开启预加载的地图会在适当时刻提前加载周边和上一级的地图数据，优化使用体验。该参数默认值true。  (自v1.4.4开始支持)
    preloadMode?: boolean;
    // 为 Map 实例指定掩模的路径，各图层将只显示路径范围内图像，3D视图下有效。
    mask?: Array<any>
  }

  export class View2D {
    constructor (options: View2DOptions);
  }

  export interface View2DOptions {
    center: LngLat;
    rotation: number;
    zoom: number;
    crs: string;
  }

  export class ArrayBounds {
    constructor (bounds: Array<LngLat | Pixel>);
    contains(opt: LngLat | Pixel): boolean;
    bounds:  Array<LngLat | Pixel>;
  }
}

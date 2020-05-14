import { floorMod } from './utils';
import Vector from './Vector';

export interface IField {
  xmin: number; // 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围
  ymin: number;
  xmax: number;
  ymax: number;
  deltaX: number; // x（经度）增量
  deltaY: number; // y（维度）增量
  cols: number; // 列（可由 `(xmax - xmin) / deltaX` 得到）
  rows: number; // 行
  us: number[]; // U分量
  vs: number[]; // V分量
  wrappedX?: boolean; // 当数据范围时按照 [0, 360] 时需要对x方向进行切割转换为 [-180, 180]
}

export interface IPosition {
  age?: number;
  x?: number;
  y?: number;
  xt?: number;
  yt?: number;
  m?: number;
}

export default class Field {
  private readonly xmin: number;
  private readonly xmax: number;
  private readonly ymin: number;
  private readonly ymax: number;
  private readonly cols: number;
  private readonly rows: number;
  private readonly us: number[];
  private readonly vs: number[];
  private readonly isContinuous: boolean;
  private readonly deltaY: number;
  private readonly deltaX: number;
  private readonly wrappedX: undefined | boolean;
  private readonly isFields: boolean;
  public grid: (Vector | null)[][];
  public range: (number | undefined)[] | undefined;
  private columns: (Vector | null)[][];
  private fieldConfig: { width: number; unproject: any; height: number };

  constructor(params: IField) {
    this.grid = [];

    this.xmin = params.xmin;
    this.xmax = params.xmax;

    this.ymin = Math.min(params.ymax, params.ymin);
    this.ymax = Math.max(params.ymax, params.ymin);

    this.cols = params.cols; // 列数
    this.rows = params.rows; // 行数

    this.us = params.us; //
    this.vs = params.vs;

    this.deltaX = params.deltaX; // x 方向增量
    this.deltaY = params.deltaY; // y方向增量

    this.isFields = true;

    const cols = Math.ceil((this.xmax - this.xmin) / params.deltaX); // 列
    const rows = Math.ceil((this.ymax - this.ymin) / params.deltaY); // 行

    if (cols !== this.cols || rows !== this.rows) {
      console.warn('The data grid not equal');
    }

    // Math.floor(ni * Δλ) >= 360;
    // lon lat 经度 纬度
    this.isContinuous = Math.floor(this.cols * params.deltaX) >= 360;
    this.wrappedX = 'wrappedX' in params ? params.wrappedX : this.xmax > 180; // [0, 360] --> [-180, 180];

    this.grid = this.buildGrid();
    this.range = this.calculateRange();
  }

  // from https://github.com/sakitam-fdd/wind-layer/blob/95368f9433/src/windy/windy.js#L110
  public buildGrid(): (Vector | null)[][] {
    let grid = [];
    let p = 0;

    const { rows, cols, us, vs } = this;

    for (let j = 0; j < rows; j++) {
      const row = [];
      for (let i = 0; i < cols; i++, p++) {
        let u = us[p];
        let v = vs[p];
        let valid = this.isValid(u) && this.isValid(v);
        row[i] = valid ? new Vector(u, v) : null;
      }

      if (this.isContinuous) {
        row.push(row[0]);
      }

      grid[j] = row;
    }
    return grid;
  }

  public release() {
    this.grid = [];
    this.columns = [];
  }

  /**
   * grib data extent
   * 格点数据范围
   */
  public extent() {
    return [
      this.xmin,
      this.ymin,
      this.xmax,
      this.ymax,
    ]
  }

  /**
   * Bilinear interpolation for Vector
   * 针对向量进行双线性插值
   * https://en.wikipedia.org/wiki/Bilinear_interpolation
   * @param   {Number} x
   * @param   {Number} y
   * @param   {Number[]} g00
   * @param   {Number[]} g10
   * @param   {Number[]} g01
   * @param   {Number[]} g11
   * @returns {Vector}
   */
  private bilinearInterpolateVector(
    x: number, y: number,
    g00: { u: number; v: number; },
    g10: { u: number; v: number; },
    g01: { u: number; v: number; },
    g11: { u: number; v: number; }
  ) {
    const rx = 1 - x;
    const ry = 1 - y;

    const a = rx * ry;
    const b = x * ry;
    const c = rx * y;
    const d = x * y;
    const u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
    const v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
    return new Vector(u, v);
  }

  /**
   * calculate vector value range
   */
  calculateRange() {
    if (!this.grid || !this.grid[0]) return;
    const rows = this.grid.length as number;
    const cols = this.grid[0].length as number;

    // const vectors = [];
    let min;
    let max;
    // @from: https://stackoverflow.com/questions/13544476/how-to-find-max-and-min-in-array-using-minimum-comparisons
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const vec = this.grid[j][i];

        if (vec !== null) {
          const val = vec.m || vec.magnitude();
          if (min === undefined) {
            min = val;
          } else if (max === undefined) {
            max = val;
            // update min max
            // 1. Pick 2 elements(a, b), compare them. (say a > b)
            min = Math.min(min, max);
            max = Math.max(min, max);
          } else {
            // 2. Update min by comparing (min, b)
            // 3. Update max by comparing (max, a)
            min = Math.min(val, min);
            max = Math.max(val, max);
          }
        }
      }
    }
    return [min, max];
  }

  /**
   * 检查 uv是否合法
   * @param x
   * @private
   */
  public isValid(x: any) {
    return x !== null && x !== undefined;
  }

  private getWrappedLongitudes() {
    let xmin = this.xmin;
    let xmax = this.xmax;

    if (this.wrappedX) {
      if (this.isContinuous) {
        xmin = -180;
        xmax = 180;
      } else {
        // not sure about this (just one particular case, but others...?)
        xmax = this.xmax - 360;
        xmin = this.xmin - 360;
        /* eslint-disable no-console */
        // console.warn(`are these xmin: ${xmin} & xmax: ${xmax} OK?`);
        // TODO: Better throw an exception on no-controlled situations.
        /* eslint-enable no-console */
      }
    }
    return [xmin, xmax];
  }

  public contains(lon: number, lat: number) {
    const [xmin, xmax] = this.getWrappedLongitudes();
    let longitudeIn = lon >= xmin && lon <= xmax;
    let latitudeIn = lat >= this.ymin && lat <= this.ymax;
    return longitudeIn && latitudeIn;
  }

  /**
   * 获取经纬度所在的位置索引
   * @param lon
   * @param lat
   */
  public getDecimalIndexes(lon: number, lat: number) {
    const i = floorMod(lon - this.xmin, 360) / this.deltaX; // calculate longitude index in wrapped range [0, 360)
    const j = (this.ymax - lat) / this.deltaY; // calculate latitude index in direction +90 to -90
    return [i, j];
  }

  /**
   * Nearest value at lon-lat coordinates
   * 线性插值
   * @param lon
   * @param lat
   */
  public valueAt(lon: number, lat: number) {

    if (!this.contains(lon, lat)) return null;

    const indexes = this.getDecimalIndexes(lon, lat);
    let ii = Math.floor(indexes[0]);
    let jj = Math.floor(indexes[1]);

    const ci = this.clampColumnIndex(ii);
    const cj = this.clampRowIndex(jj);

    return this.valueAtIndexes(ci, cj);
  }

  private interpolateColumn(y: number) {
    const column = [];
    const width = this.fieldConfig.width;
    for (let x = 0; x <= width; x += 2) {
      const coords = this.fieldConfig.unproject([x, y]);
      if (coords) {
        const [lng, lat] = coords;
        if (isFinite(lng)) {
          const wind = this.interpolatedValueAt(lng, lat);
          if (wind) {
            column[x / 2] = wind;
          }
        }
      }
    }
    this.columns[y / 2] = column;
  }

  public startBatchInterpolate(width: number, height: number, unproject: any) {
    this.columns = [];
    this.fieldConfig = {
      width,
      height,
      unproject,
    };

    this.batchInterpolate();
  }

  private batchInterpolate() {
    const start = Date.now();
    let y = 0;
    while (y < this.fieldConfig.height) {
      this.interpolateColumn(y);
      y += 2;
      if ((Date.now() - start) > 1000) { //MAX_TASK_TIME) {
        setTimeout(this.batchInterpolate.bind(this), 25);
        return;
      }
    }
  }

  /**
   * 根据像素坐标查找向量
   * @param x
   * @param y
   */
  public valueAtPixel(x: number, y: number) {
    const column = this.columns[Math.round(y / 2)];
    return column && column[Math.round(x / 2)] || null;
  }

  /**
   * Get interpolated grid value lon-lat coordinates
   * 双线性插值
   * @param lon
   * @param lat
   */
  public interpolatedValueAt(lon: number, lat: number) {
    if (!this.contains(lon, lat)) return null;

    let [i, j] = this.getDecimalIndexes(lon, lat);
    return this.interpolatePoint(i, j);
  }

  public hasValueAt(lon: number, lat: number) {
    let value = this.valueAt(lon, lat);
    return value !== null;
  }

  /**
   * 基于向量的双线性插值
   * @param i
   * @param j
   */
  private interpolatePoint(i: number, j: number) {
    //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
    //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
    //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
    //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
    //    j ___|_ .   |           (1, 9) and (2, 9).
    //  =8.3   |      |
    //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
    //         |      |           column, so the index ci can be used without taking a modulo.
    const indexes = this.getFourSurroundingIndexes(i, j);
    const [fi, ci, fj, cj] = indexes;
    let values = this.getFourSurroundingValues(fi, ci, fj, cj);
    if (values) {
      const [g00, g10, g01, g11] = values;
      // @ts-ignore
      return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
    }

    return null;
  }

  /**
   * Check the column index is inside the field,
   * adjusting to min or max when needed
   * @private
   * @param   {Number} ii - index
   * @returns {Number} i - inside the allowed indexes
   */
  private clampColumnIndex(ii: number) {
    let i = ii;
    if (ii < 0) {
      i = 0;
    }
    let maxCol = this.cols - 1;
    if (ii > maxCol) {
      i = maxCol;
    }
    return i;
  }

  /**
   * Check the row index is inside the field,
   * adjusting to min or max when needed
   * @private
   * @param   {Number} jj index
   * @returns {Number} j - inside the allowed indexes
   */
  private clampRowIndex(jj: number) {
    let j = jj;
    if (jj < 0) {
      j = 0;
    }
    let maxRow = this.rows - 1;
    if (jj > maxRow) {
      j = maxRow;
    }
    return j;
  }

  /**
   * from: https://github.com/IHCantabria/Leaflet.CanvasLayer.Field/blob/master/src/Field.js#L252
   * 计算索引位置周围的数据
   * @private
   * @param   {Number} i - decimal index
   * @param   {Number} j - decimal index
   * @returns {Array} [fi, ci, fj, cj]
   */
  private getFourSurroundingIndexes(i: number, j: number) {
    let fi = Math.floor(i); // 左
    let ci = fi + 1; // 右
    // duplicate colum to simplify interpolation logic (wrapped value)
    if (this.isContinuous && ci >= this.cols) {
      ci = 0;
    }
    ci = this.clampColumnIndex(ci);

    let fj = this.clampRowIndex(Math.floor(j)); // 上 纬度方向索引（取整）
    let cj = this.clampRowIndex(fj + 1); // 下

    return [fi, ci, fj, cj];
  }

  /**
   * from https://github.com/IHCantabria/Leaflet.CanvasLayer.Field/blob/master/src/Field.js#L277
   * Get four surrounding values or null if not available,
   * from 4 integer indexes
   * @private
   * @param   {Number} fi
   * @param   {Number} ci
   * @param   {Number} fj
   * @param   {Number} cj
   * @returns {Array}
   */
  private getFourSurroundingValues(fi: number, ci: number, fj: number, cj: number) {
    let row;
    if ((row = this.grid[fj])) {
      const g00 = row[fi]; // << left
      const g10 = row[ci]; // right >>
      if (
        this.isValid(g00) &&
        this.isValid(g10) &&
        (row = this.grid[cj])
      ) {
        // lower row vv
        const g01 = row[fi]; // << left
        const g11 = row[ci]; // right >>
        if (this.isValid(g01) && this.isValid(g11)) {
          return [g00, g10, g01, g11]; // 4 values found!
        }
      }
    }
    return null;
  }

  /**
   * Value for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Vector|Number}
   */
  public valueAtIndexes(i: number, j: number) {
    return this.grid[j][i]; // <-- j,i !!
  }

  /**
   * Lon-Lat for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Number[]} [lon, lat]
   */
  public lonLatAtIndexes(i: number, j: number) {
    let lon = this.longitudeAtX(i);
    let lat = this.latitudeAtY(j);

    return [lon, lat];
  }

  /**
   * Longitude for grid-index
   * @param   {Number} i - column index (integer)
   * @returns {Number} longitude at the center of the cell
   */
  private longitudeAtX(i: number) {
    let halfXPixel = this.deltaX / 2.0;
    let lon = this.xmin + halfXPixel + i * this.deltaX;
    if (this.wrappedX) {
      lon = lon > 180 ? lon - 360 : lon;
    }
    return lon;
  }

  /**
   * Latitude for grid-index
   * @param   {Number} j - row index (integer)
   * @returns {Number} latitude at the center of the cell
   */
  private latitudeAtY(j: number) {
    let halfYPixel = this.deltaY / 2.0;
    return this.ymax - halfYPixel - j * this.deltaY;
  }

  /**
   * 生成粒子位置
   * @param o
   * @param width
   * @param height
   */
  public randomize(o: IPosition = {}, width?: number, height?: number) {
    if (width && height) {
      let x;
      let y;
      let safetyNet = 0;
      do {
        x = Math.round(Math.random() * width);
        y = Math.round(Math.random() * height);
      } while (!this.valueAtPixel(x, y) && safetyNet++ < 30);

      o.x = x;
      o.y = y;
    } else {
      let i = (Math.random() * this.cols) | 0;
      let j = (Math.random() * this.rows) | 0;

      o.x = this.longitudeAtX(i);
      o.y = this.latitudeAtY(j);
    }

    return o;
  }

  /**
   * check is custom field
   */
  public checkFields() {
    return this.isFields;
  }
}

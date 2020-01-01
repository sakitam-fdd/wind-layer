import Cell from './Cell';

// refTime: "2016-04-06T12:00:00.000Z"
// parameterCategory: 0
// parameterCategoryName: "Temperature"
// parameterNumber: 0
// parameterNumberName: "Temperature"
// parameterUnit: "K"
// numberPoints: 65160
// shape: 6
// shapeName: "Earth spherical with radius of 6,371,229.0 m"
// gridUnits: "degrees"
// resolution: 48
// winds: "true"
// scanMode: 0
// nx: 360
// ny: 181
// basicAngle: 0
// subDivisions: 0
// lo1: 0
// la1: 90
// lo2: 359
// la2: -90
// dx: 1
// dy: 1

export interface IField {
  xmin: number; // 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围
  ymin: number;
  xmax: number;
  ymax: number;
  deltaX: number; // x（经度）增量
  deltaY: number; // y（维度）增量
  cols: number; // 列（可由 `(xmax - xmin) / deltaX` 得到）
  rows: number; // 行
}

export default class Field {
  private xmin: number;
  private xmax: number;
  private ymin: number;
  private ymax: number;
  private cols: number;
  private rows: number;
  private grid: null;
  constructor(params: IField) {
    this.grid = null;

    this.xmin = params.xmin;
    this.xmax = params.xmax;

    this.ymin = params.ymin;
    this.ymax = params.ymax;

    this.cols = params.cols;
    this.rows = params.rows;

    const cols = Math.ceil((this.xmax - this.xmin) / params.deltaX);
    const rows = Math.ceil((this.ymax - this.ymin) / params.deltaY);

    if (cols !== this.cols || rows !== this.rows) {
      console.warn('The data grid is not available');
    }
  }

  /**
   * Bilinear interpolation for Vector
   * https://en.wikipedia.org/wiki/Bilinear_interpolation
   * @param   {Number} x
   * @param   {Number} y
   * @param   {Number[]} g00
   * @param   {Number[]} g10
   * @param   {Number[]} g01
   * @param   {Number[]} g11
   * @returns {Vector}
   */
  _doInterpolation(x, y, g00, g10, g01, g11) {
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
   * Is valid (not 'null' nor 'undefined')
   * @private
   * @param   {Object} x object
   * @returns {Boolean}
   */
  _isValid(x) {
    return x !== null && x !== undefined;
  }

  /**
   * Nearest value at lon-lat coordinates
   * @param   {Number} longitude
   * @param   {Number} latitude
   * @returns {Vector|Number}
   */
  valueAt(lon, lat) {

    if (!this.contains(lon, lat)) return null;

    const indexes = this._getDecimalIndexes(lon, lat);
    let value = this._valueAtIndexes(indexes[0], indexes[1]);
    return new Vector(value[0], value[1]);
  }

  hasValueAt(lon, lat) {

    let value = this.valueAt(lon, lat);

    const hasValue = value !== null;
    let included = true;
    // if (this._inFilter) {
    //     if (until.isFunction(this._inFilter))
    //         included = this._inFilter(value);
    //     else if (!until.isNil(this._inFilter.min) && !until.isNil(this._inFilter.max)) {
    //         const {min, max} = this._inFilter;
    //         included = value <= max && value >= min;
    //     }
    //
    // }
    return hasValue && included;
  }

  interpolatedValueAtIndexes(i, j) {
    //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
    //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
    //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
    //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
    //    j ___|_ .   |           (1, 9) and (2, 9).
    //  =8.3   |      |
    //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
    //         |      |           column, so the index ci can be used without taking a modulo.
    const indexes = this._getFourSurroundingIndexes(i, j);
    const [fi, ci, fj, cj] = indexes;
    let values = this._getFourSurroundingValues(fi, ci, fj, cj);
    values = values.map((v) => new Vector(v[0], v[1]));

    if (values) {
      const [g00, g10, g01, g11] = values;
      return this._doInterpolation(i - fi, j - fj, g00, g10, g01, g11);
    }
    return null;
  }

  /**
   * Value for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Vector|Number}
   */
  _valueAtIndexes(i, j) {
    return this.grid[j][i]; // <-- j,i !!
  }

  /**
   * Lon-Lat for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Number[]} [lon, lat]
   */
  _lonLatAtIndexes(i, j) {
    let lon = this._longitudeAtX(i);
    let lat = this._latitudeAtY(j);

    return [lon, lat];
  }

  /**
   * Longitude for grid-index
   * @param   {Number} i - column index (integer)
   * @returns {Number} longitude at the center of the cell
   */
  _longitudeAtX(i) {
    let halfXPixel = this.cellXSize / 2.0;
    let lon = this.xllCorner + halfXPixel + i * this.cellXSize;
    if (this.longitudeNeedsToBeWrapped) {
      lon = lon > 180 ? lon - 360 : lon;
    }
    return lon;
  }

  /**
   * Latitude for grid-index
   * @param   {Number} j - row index (integer)
   * @returns {Number} latitude at the center of the cell
   */
  _latitudeAtY(j) {
    let halfYPixel = this.cellYSize / 2.0;
    return this.yurCorner - halfYPixel - j * this.cellYSize;
  }

  randomize(o: any = {}) {

    // field.randomize = function (o) {  // UNDONE: this method is terrible
    //   var x, y;
    //   var safetyNet = 0;
    //   do {
    //     x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
    //     y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
    //   } while (field(x, y)[2] === null && safetyNet++ < 30);
    //   o.x = x;
    //   o.y = y;
    //   return o;
    // };

    let i = (Math.random() * this.nCols) | 0;
    let j = (Math.random() * this.nRows) | 0;

    o.x = this._longitudeAtX(i);
    o.y = this._latitudeAtY(j);

    return o;
  }
}

export default class Cell {
  private ySize: number;
  private xSize: number;
  private value: any;
  private center: [number, number];

  /**
   * A simple cell with a numerical value
   * @param {Array} center
   * @param {Number|Vector} value
   * @param {Number} xSize
   * @param {Number} ySize
   */
  constructor(center: [number, number], value: any, xSize: number, ySize: number = xSize) {
    this.center = center;
    this.value = value;
    this.xSize = xSize;
    this.ySize = ySize;
  }

  equals(anotherCell: any) {
    return (
      this.center[0] === anotherCell.center[0] && this.center[1] === anotherCell.center[1] &&
      this._equalValues(this.value, anotherCell.value) &&
      this.xSize === anotherCell.xSize &&
      this.ySize === anotherCell.ySize
    );
  }

  _equalValues(value, anotherValue) {
    let type = value.constructor.name;
    let answerFor = {
      Number: value === anotherValue,
      Vector: value.u === anotherValue.u && value.v === anotherValue.v
    };
    return answerFor[type];
  }

  /**
   * Bounds for the cell
   * @returns {Number[]}
   */
  getBounds() {
  }
}

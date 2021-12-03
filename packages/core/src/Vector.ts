export default class Vector {
  public u: number;
  public v: number;
  public m: number;

  constructor(u: number, v: number) {
    this.u = u;
    this.v = v;

    this.m = this.magnitude();
  }

  /**
   * 向量值（这里指风速）
   * @returns {Number}
   */
  public magnitude() {
    return Math.sqrt(this.u ** 2 + this.v ** 2);
  }

  /**
   * 流体方向 （这里指风向，范围为0-360º）
   * N is 0º and E is 90º
   * @returns {Number}
   */
  public directionTo() {
    const verticalAngle = Math.atan2(this.u, this.v);
    let inDegrees = verticalAngle * (180.0 / Math.PI);
    if (inDegrees < 0) {
      inDegrees += 360.0;
    }
    return inDegrees;
  }

  /**
   * Angle in degrees (0 to 360º) From x-->
   * N is 0º and E is 90º
   * @returns {Number}
   */
  public directionFrom() {
    const a = this.directionTo();
    return (a + 180.0) % 360.0;
  }
}

// from: https://sourcegraph.com/github.com/IHCantabria/Leaflet.CanvasLayer.Field/-/blob/src/Vector.js?utm_source=share
export default class Vector {
  private readonly u: number;
  private readonly v: number;
  constructor(u: number, v: number) {
    this.u = u;
    this.v = v;
  }

  /**
   * Magnitude
   * @returns {Number}
   */
  magnitude() {
    return Math.sqrt(this.u * this.u + this.v * this.v);
  }

  /**
   * Angle in degrees (0 to 360º) --> Towards
   * N is 0º and E is 90º
   * @returns {Number}
   */
  directionTo() {
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
  directionFrom() {
    const a = this.directionTo();
    return (a + 180.0) % 360.0;
  }
}

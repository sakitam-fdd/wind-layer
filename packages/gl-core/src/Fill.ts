import Base from './Base';
// @ts-ignore
import FillFrag from './shaders/currency-fill.frag.glsl';
// @ts-ignore
import FillVert from './shaders/currency-fill.vert.glsl';

export class Fill extends Base {
  public vertShader = FillVert;

  public fragShader = FillFrag;

  constructor(gl: WebGLRenderingContext, vShader?: string, fShader?: string) {
    super(gl, vShader || FillVert, fShader || FillFrag);
  }

  public draw() {
    // draw
    const primitiveType = this.gl.TRIANGLES;
    this.gl.drawArrays(primitiveType, 0, this.count);

    return this;
  }

  public translate() {
    return this;
  }

  public rotate() {
    return this;
  }

  public scale() {
    return this;
  }
}

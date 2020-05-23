import Base from './Base';
// @ts-ignore
import FillFrag from './shaders/wind-fill.frag.glsl';
// @ts-ignore
import FillVert from './shaders/wind-fill.vert.glsl';

export class WindFill extends Base {
  vertShader = FillVert;

  fragShader = FillFrag;

  constructor (gl: WebGLRenderingContext, vShader?: string, fShader?: string) {
    super(gl, vShader || FillVert, fShader || FillFrag);
  }

  draw() {
    // draw
    const primitiveType = this.gl.TRIANGLES;
    this.gl.drawArrays(primitiveType, 0, this.count);

    return this;
  }

  translate() {
    return this;
  }

  rotate() {
    return this;
  }

  scale() {
    return this;
  }
}

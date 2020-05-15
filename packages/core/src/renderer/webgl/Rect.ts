import Base from './Base';
// @ts-ignore
import RectFrag from './shaders/rect.frag.glsl';
// @ts-ignore
import RectVert from './shaders/rect.vert.glsl';

export class Rect extends Base {
  vertShader = RectVert;

  fragShader = RectFrag;

  constructor (gl: WebGLRenderingContext, vShader?: string, fShader?: string) {
    super(gl, vShader || RectVert, fShader || RectFrag);
  }

  updateProjection() {
    return this;
  }

  draw() {
    // draw
    const primitiveType = this.gl.POINTS;
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

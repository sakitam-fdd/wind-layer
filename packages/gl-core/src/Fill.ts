import Base from './Base';
import FillFrag from './shaders/currency-fill.frag.glsl';
import FillVert from './shaders/currency-fill.vert.glsl';

export class Fill extends Base {
  public vertShader = FillVert;

  public fragShader = FillFrag;
  private checkExt: OES_element_index_uint | null;

  constructor(
    gl: WebGLRenderingContext,
    vShader?: string,
    fShader?: string,
    modules?: {
      [key: string]: string;
    },
  ) {
    super(gl, vShader || FillVert, fShader || FillFrag, modules || {});
  }

  public draw() {
    // draw
    if (this.checkExt !== undefined) {
      const primitiveType = this.primitive || this.gl.TRIANGLES;
      // gl.UNSIGNED_BYTE对应Uint8Array，gl.UNSIGNED_SHORT对应Uint16Array
      if (this.checkExt) {
        this.gl.drawElements(
          primitiveType,
          this.count,
          this.gl.UNSIGNED_INT,
          0,
        );
      } else {
        this.gl.drawElements(
          primitiveType,
          this.count,
          this.gl.UNSIGNED_SHORT,
          0,
        );
      }
    } else {
      this.checkExt = this.gl.getExtension('OES_element_index_uint');
    }

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

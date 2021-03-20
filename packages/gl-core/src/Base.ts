import { clearScene, createProgram, resizeCanvasSize } from './utils/gl-utils';

export interface BufferComponents {
  buffer: WebGLBuffer;
  numComponents?: number;
  size?: number;
  type?: GLenum;
  normalize?: boolean;
  stride?: number;
  offset?: number;
}

export interface UniformSetters {
  [key: string]: (arg: any) => void;
}

export interface UniformValues {
  [key: string]: any;
}

export interface AttribSetters {
  [key: string]: (arg: any) => void;
}

export interface AttribValues {
  [key: string]: any;
}

export type ElementsDataType = Uint8Array | Uint16Array;

export type ElementsData = Uint8Array | Uint16Array | Uint32Array;

export interface IElementsOptions {
  data?: ElementsData | null;
  usage?: GLenum;
  primitive?: GLenum;
  count?: number;
}

export default class Base {
  public vertShader = '';

  public fragShader = '';
  public readonly gl: WebGLRenderingContext;
  public count: number;
  public readonly program: WebGLProgram | null;
  public textureUnit: number;
  public uniformSetters: UniformSetters;
  public attribSetters: AttribSetters;
  public transfromStack: Array<() => void>;
  public elementsBuffer: WebGLBuffer | null;
  public primitive: GLenum;

  constructor(gl: WebGLRenderingContext, vShader: string, fShader: string) {
    if (vShader) {
      this.vertShader = vShader;
    }
    if (fShader) {
      this.fragShader = fShader;
    }

    this.program = createProgram(gl, this.vertShader, this.fragShader);

    this.gl = gl;

    this.textureUnit = 0;

    this.uniformSetters = this.createUniformSetters();
    this.attribSetters = this.createAttributeSetters();

    this.transfromStack = []; // 矩阵变换调用栈
  }

  public active() {
    this.gl.useProgram(this.program);
    return this;
  }

  public deactive() {
    this.gl.deleteProgram(this.program);
    return this;
  }

  /**
   * from webgl-utils
   * @param gl
   * @param type
   * @returns {GLenum|undefined}
   */
  public getBindPointForSamplerType(gl: WebGLRenderingContext, type: GLenum) {
    if (type === gl.SAMPLER_2D) {
      return gl.TEXTURE_2D;
    } // eslint-disable-line
    if (type === gl.SAMPLER_CUBE) {
      return gl.TEXTURE_CUBE_MAP;
    } // eslint-disable-line
    return undefined;
  }

  /**
   * from webgl-utils
   * @param program
   * @param uniformInfo
   * @returns {function(...[*]=)}
   */
  public createUniformSetter(
    program: WebGLProgram,
    uniformInfo: WebGLActiveInfo,
  ) {
    const { gl } = this;
    const location = gl.getUniformLocation(program, uniformInfo.name);
    const type = uniformInfo.type;
    // Check if this uniform is an array
    const isArray =
      uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';
    if (type === gl.FLOAT && isArray) {
      return function(v: Float32List) {
        gl.uniform1fv(location, v);
      };
    }
    if (type === gl.FLOAT) {
      return function(v: GLfloat) {
        gl.uniform1f(location, v);
      };
    }
    if (type === gl.FLOAT_VEC2) {
      return function(v: Float32List) {
        gl.uniform2fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC3) {
      return function(v: Float32List) {
        gl.uniform3fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC4) {
      return function(v: Float32List) {
        gl.uniform4fv(location, v);
      };
    }
    if (type === gl.INT && isArray) {
      return function(v: Int32List) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.INT) {
      return function(v: GLint) {
        gl.uniform1i(location, v);
      };
    }
    if (type === gl.INT_VEC2) {
      return function(v: Int32List) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.INT_VEC3) {
      return function(v: Int32List) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.INT_VEC4) {
      return function(v: Int32List) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.BOOL) {
      return function(v: Int32List) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC2) {
      return function(v: Int32List) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC3) {
      return function(v: Int32List) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC4) {
      return function(v: Int32List) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.FLOAT_MAT2) {
      return function(v: Float32List) {
        gl.uniformMatrix2fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT3) {
      return function(v: Float32List) {
        gl.uniformMatrix3fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT4) {
      return function(v: Float32List) {
        gl.uniformMatrix4fv(location, false, v);
      };
    }
    if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
      const units = [];
      for (let ii = 0; ii < uniformInfo.size; ++ii) {
        units.push(this.textureUnit++);
      }
      return (function(bindPoint: GLenum | undefined, units) {
        return function(textures: WebGLTexture[]) {
          gl.uniform1iv(location, units);
          textures.forEach(function(texture, index) {
            gl.activeTexture(gl.TEXTURE0 + units[index]);
            if (bindPoint !== undefined) {
              gl.bindTexture(bindPoint, texture);
            }
          });
        };
      })(this.getBindPointForSamplerType(gl, type), units);
    }
    if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
      return (function(bindPoint: GLenum | undefined, unit) {
        return function(texture: WebGLTexture) {
          gl.uniform1i(location, unit);
          gl.activeTexture(gl.TEXTURE0 + unit);
          if (bindPoint !== undefined) {
            gl.bindTexture(bindPoint, texture);
          }
        };
      })(this.getBindPointForSamplerType(gl, type), this.textureUnit++);
    }
    throw new Error('unknown type: 0x' + type.toString(16)); // we should never get here.
  }

  /**
   * from webgl-utils
   * @returns {{}}
   */
  public createUniformSetters() {
    const { gl } = this;
    this.textureUnit = 0;
    const uniformSetters: UniformSetters = {};

    if (this.program !== null) {
      const numUniforms = gl.getProgramParameter(
        this.program,
        gl.ACTIVE_UNIFORMS,
      );

      for (let ii = 0; ii < numUniforms; ++ii) {
        const uniformInfo: WebGLActiveInfo | null = gl.getActiveUniform(
          this.program,
          ii,
        );
        if (!uniformInfo) {
          break;
        }
        let name = uniformInfo.name;
        // remove the array suffix.
        if (name.substr(-3) === '[0]') {
          name = name.substr(0, name.length - 3);
        }
        const setter = this.createUniformSetter(this.program, uniformInfo);
        uniformSetters[name] = setter;
      }
    }

    return uniformSetters;
  }

  /**
   * from webgl-utils
   * @returns {function(...[*]=)}
   */
  public createAttribSetter(index: number) {
    const { gl } = this;
    return function(b: BufferComponents) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      if (b.numComponents !== undefined || b.size !== undefined) {
        gl.vertexAttribPointer(
          index,
          (b.numComponents || b.size) as number,
          b.type || gl.FLOAT,
          b.normalize || false,
          b.stride || 0,
          b.offset || 0,
        );
      }
    };
  }

  public createAttributeSetters() {
    const { gl } = this;
    const attribSetters: AttribSetters = {};

    if (this.program !== null) {
      const numAttribs = gl.getProgramParameter(
        this.program,
        gl.ACTIVE_ATTRIBUTES,
      );
      for (let ii = 0; ii < numAttribs; ++ii) {
        const attribInfo: WebGLActiveInfo | null = gl.getActiveAttrib(
          this.program,
          ii,
        );
        if (!attribInfo) {
          break;
        }
        const index = gl.getAttribLocation(this.program, attribInfo.name);
        attribSetters[attribInfo.name] = this.createAttribSetter(index);
      }
    }

    return attribSetters;
  }

  public setAttributes(attribs: AttribValues, setters?: AttribSetters | any) {
    if (setters) {
      setters = setters.attribSetters || setters;
    } else {
      setters = this.attribSetters;
    }
    Object.keys(attribs).forEach(function(name) {
      const setter = setters[name];
      if (setter) {
        setter(attribs[name]);
      }
    });
    return this;
  }

  public setUniforms(values: UniformValues, setters?: UniformSetters | any) {
    if (setters) {
      setters = setters.uniformSetters || setters;
    } else {
      setters = this.uniformSetters;
    }
    Object.keys(values).forEach(function(name) {
      const setter = setters[name];
      if (setter) {
        setter(values[name]);
      }
    });

    return this;
  }

  public elements(element: IElementsOptions) {
    if (!this.elementsBuffer) {
      this.elementsBuffer = this.gl.createBuffer();
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.elementsBuffer);
    if (element.data) {
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        element.data,
        element?.usage || this.gl.STATIC_DRAW,
      );
    }
    if (element.count !== undefined) {
      this.runTimes(element.count);
    }

    if (element.primitive) {
      this.setPrimitive(element.primitive);
    }

    return this;
  }

  /**
   * 可以override，默认使用此种方式清空画布
   * @param color
   * @returns {Base}
   */
  public clear(color: number[]) {
    clearScene(this.gl, color);
    this.transfromStack = [];
    return this;
  }

  /**
   * 运行次数
   * TODO: 目前没有好的方式去绑定顶点数量的关系
   * @param count
   */
  public runTimes(count: number) {
    this.count = count || 0;
    return this;
  }

  public setPrimitive(primitive?: GLenum) {
    this.primitive = primitive || this.gl.TRIANGLES;
  }

  public resize() {
    resizeCanvasSize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    return this;
  }

  public draw() {
    throw new Error('should override');
  }

  public translate() {
    throw new Error('should override');
  }

  public rotate() {
    throw new Error('should override');
  }

  public scale() {
    throw new Error('should override');
  }
}

// 大量代码来自于 [webgl-utils](https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/webgl-utils.js)

export function getDevicePixelRatio () {
  return devicePixelRatio || 1;
}

/**
 * resize gl context
 * @link https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
 * @link https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-anti-patterns.html
 * @param canvas
 * @param pixelRatio
 * @returns {boolean}
 */
export function resizeCanvasSize (canvas: HTMLCanvasElement | OffscreenCanvas, pixelRatio?: number) {
  if (!canvas) return false;
  pixelRatio = pixelRatio || getDevicePixelRatio();
  if (!(canvas instanceof OffscreenCanvas)) {
    const width = canvas.clientWidth * pixelRatio;
    const height = canvas.clientHeight * pixelRatio;
    if (width <= 0 || height <= 0) {
      return false;
    } else if (canvas.width !== width ||
      canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
  }

  return false;
}

/**
 * get gl context
 * @param canvas
 * @param glOptions
 * @returns {null}
 */
export function getGlContext (canvas: HTMLCanvasElement, glOptions = {}) {
  const names = ['webgl', 'experimental-webgl'];
  let context: WebGLRenderingContext | null = null;

  function onContextCreationError (error: any) {
    console.error(error.statusMessage);
  }

  canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
  for (let ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], glOptions) as WebGLRenderingContext;
    } catch(e) {}  // eslint-disable-line
    if (context) {
      break;
    }
  }

  canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);

  if (!context || !context.getExtension('OES_texture_float')) {
    return null;
  }
  return context;
}

/**
 * create shader and compile shader
 * @param gl
 * @param type
 * @param source
 * @returns {WebGLShader}
 */
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error(gl.getShaderInfoLog(shader) || '');
  }
  return shader;
}

/**
 * create program from vertex and frag
 * @param gl
 * @param vertexShaderSource
 * @param fragmentShaderSource
 * @returns {WebGLProgram}
 */
export function createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null {
  // create the shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  if (program !== null) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || '')
    }
  }

  return program;
}

/**
 * create 2d texture
 * @param gl
 * @param filter
 * @param data
 * @param width
 * @param height
 * @returns {WebGLTexture}
 */
export function createTexture(gl: WebGLRenderingContext, filter: GLint, data: TexImageSource | Uint8Array, width: number, height: number): WebGLTexture | null {
  // 创建纹理对象
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 指定水平方向填充算法
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // 指定垂直方向填充算法
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // 指定缩小算法
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  // 指定放大算法
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  if (data instanceof Uint8Array) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

/**
 * bind texture
 * @param gl
 * @param texture
 * @param unit
 */
export function bindTexture(gl: WebGLRenderingContext, texture: WebGLTexture, unit: number) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

/**
 * delete texture
 * @param gl
 * @param texture
 */
export function destroyTexture (gl: WebGLRenderingContext, texture: WebGLTexture) {
  gl.deleteTexture(texture)
}

/**
 * create data buffer
 * @param gl
 * @param data
 * @returns {AudioBuffer | WebGLBuffer}
 */
export function createBuffer(gl: WebGLRenderingContext, data: any) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  if (data) {
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  return buffer;
}

/**
 * bind attribute
 * @param gl
 * @param buffer
 * @param attribute
 * @param numComponents
 */
export function bindAttribute(gl: WebGLRenderingContext, buffer: WebGLBuffer, attribute: GLuint, numComponents: GLint) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
}

/**
 * bind framebuffer
 * @param gl
 * @param framebuffer
 * @param texture
 */
export function bindFramebuffer(gl: WebGLRenderingContext, framebuffer: WebGLFramebuffer, texture: WebGLTexture) {
  // 创建一个帧缓冲
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    // 绑定纹理到帧缓冲
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
}

/**
 * clear scene
 * @param gl
 * @param color
 */
export function clearScene (gl: WebGLRenderingContext, color: number[]) {
  const [r, g, b, a] = color;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(r, g, b, a);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
}

/**
 * load image by url
 * @param src
 * @returns {Promise<Image>}
 */
export function loadImage (src: string): Promise<HTMLImageElement> {
  return new Promise(((resolve, reject) => {
    if (!src) {
      reject(new Event('url is null'));
    }
    const image = new Image();

    image.crossOrigin = 'anonymous';

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = src;

    if (image.complete) {
      resolve(image);
    }
  }))
}
//
// // This is really just a guess. Though I can't really imagine using
// // anything else? Maybe for some compression?
// function getNormalizationForTypedArray(typedArray: any) {
//   if (typedArray instanceof Int8Array)    { return true; }  // eslint-disable-line
//   if (typedArray instanceof Uint8Array)   { return true; }  // eslint-disable-line
//   return false;
// }
//
// function isArrayBuffer(a) {
//   return a.buffer && a.buffer instanceof ArrayBuffer;
// }
//
// function allButIndices(name) {
//   return name !== 'indices';
// }
//
// function createMapping(obj) {
//   const mapping = {};
//   Object.keys(obj).filter(allButIndices).forEach(function(key) {
//     mapping['a_' + key] = key;
//   });
//   return mapping;
// }
//
// function getGLTypeForTypedArray(gl: WebGLRenderingContext, typedArray: any) {
//   if (typedArray instanceof Int8Array)    { return gl.BYTE; }            // eslint-disable-line
//   if (typedArray instanceof Uint8Array)   { return gl.UNSIGNED_BYTE; }   // eslint-disable-line
//   if (typedArray instanceof Int16Array)   { return gl.SHORT; }           // eslint-disable-line
//   if (typedArray instanceof Uint16Array)  { return gl.UNSIGNED_SHORT; }  // eslint-disable-line
//   if (typedArray instanceof Int32Array)   { return gl.INT; }             // eslint-disable-line
//   if (typedArray instanceof Uint32Array)  { return gl.UNSIGNED_INT; }    // eslint-disable-line
//   if (typedArray instanceof Float32Array) { return gl.FLOAT; }           // eslint-disable-line
//   throw 'unsupported typed array type';
// }
//
// /**
//  * instead createBuffer function
//  * @param gl
//  * @param array
//  * @param type
//  * @param drawType
//  * @returns {AudioBuffer | WebGLBuffer}
//  */
// export function createBufferFromTypedArray(gl: WebGLRenderingContext, array, type: GLenum, drawType: GLenum) {
//   type = type || gl.ARRAY_BUFFER;
//   const buffer = gl.createBuffer();
//   gl.bindBuffer(type, buffer);
//   if (array) {
//     gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
//   }
//   return buffer;
// }
//
// // Add `push` to a typed array. It just keeps a 'cursor'
// // and allows use to `push` values into the array so we
// // don't have to manually compute offsets
// function augmentTypedArray(typedArray: Float32Array | ArrayLike<any>, numComponents: number) {
//   let cursor = 0;
//   typedArray.push = function() {
//     for (let ii = 0; ii < arguments.length; ++ii) {
//       const value = arguments[ii];
//       if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
//         for (let jj = 0; jj < value.length; ++jj) {
//           typedArray[cursor++] = value[jj];
//         }
//       } else {
//         typedArray[cursor++] = value;
//       }
//     }
//   };
//   typedArray.reset = function(opt_index) {
//     cursor = opt_index || 0;
//   };
//   typedArray.numComponents = numComponents;
//   Object.defineProperty(typedArray, 'numElements', {
//     get: function() {
//       return this.length / this.numComponents | 0;
//     },
//   });
//   return typedArray;
// }
//
// function createAugmentedTypedArray(numComponents: number, numElements: number, opt_type: ArrayBufferConstructor) {
//   const Type = opt_type || Float32Array;
//   return augmentTypedArray(new Type(numComponents * numElements), numComponents);
// }
//
// function guessNumComponentsFromName(name: string, length: number) {
//   let numComponents;
//   if (name.indexOf('coord') >= 0) {
//     numComponents = 2;
//   } else if (name.indexOf('color') >= 0) {
//     numComponents = 4;
//   } else {
//     numComponents = 3;  // position, normals, indices ...
//   }
//
//   if (length % numComponents > 0) {
//     throw 'can not guess numComponents. You should specify it.';
//   }
//
//   return numComponents;
// }
//
// function makeTypedArray(array: any, name) {
//   if (isArrayBuffer(array)) {
//     return array;
//   }
//
//   if (array.data && isArrayBuffer(array.data)) {
//     return array.data;
//   }
//
//   if (Array.isArray(array)) {
//     array = {
//       data: array,
//     };
//   }
//
//   if (!array.numComponents) {
//     array.numComponents = guessNumComponentsFromName(name, array.length);
//   }
//
//   let type = array.type;
//   if (!type) {
//     if (name === 'indices') {
//       type = Uint16Array;
//     }
//   }
//   const typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
//   typedArray.push(array.data);
//   return typedArray;
// }
//
// function createAttribsFromArrays (gl: WebGLRenderingContext, arrays, opt_mapping) {
//   const mapping = opt_mapping || createMapping(arrays);
//   const attribs = {};
//   Object.keys(mapping).forEach(function(attribName) {
//     const bufferName = mapping[attribName];
//     const origArray = arrays[bufferName];
//     const array = makeTypedArray(origArray, bufferName);
//     attribs[attribName] = {
//       buffer: createBufferFromTypedArray(gl, array),
//       numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
//       type: getGLTypeForTypedArray(gl, array),
//       normalize: getNormalizationForTypedArray(array),
//     };
//   });
//   return attribs;
// }
//
// /**
//  * tries to get the number of elements from a set of arrays.
//  */
// function getNumElementsFromNonIndexedArrays(arrays) {
//   const key = Object.keys(arrays)[0];
//   const array = arrays[key];
//   if (isArrayBuffer(array)) {
//     return array.numElements;
//   } else {
//     return array.data.length / array.numComponents;
//   }
// }
//
// /**
//  * 创建buffer
//  * @param gl
//  * @param arrays
//  * @param opt_mapping
//  * @returns {{attribs: *}}
//  */
// export function createBufferInfoFromArrays(gl: WebGLRenderingContext, arrays, opt_mapping) {
//   const bufferInfo = {
//     attribs: createAttribsFromArrays(gl, arrays, opt_mapping),
//   };
//   let indices = arrays.indices;
//   if (indices) {
//     indices = makeTypedArray(indices, 'indices');
//     bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
//     bufferInfo.numElements = indices.length;
//   } else {
//     bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays);
//   }
//
//   return bufferInfo;
// }

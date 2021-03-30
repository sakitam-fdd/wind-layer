import { fp64LowPart } from './common';
// 大量代码来自于 [webgl-utils](https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/webgl-utils.js)

export function getDevicePixelRatio() {
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
export function resizeCanvasSize(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  pixelRatio?: number,
) {
  if (!canvas) {
    return false;
  }
  pixelRatio = pixelRatio || getDevicePixelRatio();
  if (!(canvas instanceof OffscreenCanvas)) {
    const width = canvas.clientWidth * pixelRatio;
    const height = canvas.clientHeight * pixelRatio;
    if (width <= 0 || height <= 0) {
      return false;
    } else if (canvas.width !== width || canvas.height !== height) {
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
export function getGlContext(canvas: HTMLCanvasElement, glOptions = {}) {
  const names = ['webgl', 'experimental-webgl'];
  let context: WebGLRenderingContext | null = null;

  function onContextCreationError(error: any) {
    console.error(error.statusMessage);
  }

  canvas.addEventListener(
    'webglcontextcreationerror',
    onContextCreationError,
    false,
  );
  for (let ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(
        names[ii],
        glOptions,
      ) as WebGLRenderingContext;
    } catch (e) {} // eslint-disable-line
    if (context) {
      break;
    }
  }

  canvas.removeEventListener(
    'webglcontextcreationerror',
    onContextCreationError,
    false,
  );

  if (!context || !context.getExtension('OES_texture_float')) {
    return null;
  }
  return context;
}

/**
 * defines
 * @param shader
 * @param defines
 */
export function defineShader(shader: string, defines: any) {
  return Object.keys(defines).reduce((str, key) => {
    return defines[key] ? str + `#define ${key} ${defines[key]}\n` : '';
  }, '');
}

/**
 * inject shader module
 * @param shader
 * @param modules
 */
export function injectShaderModule(shader: string, modules: any) {
  Object.keys(modules).map((key) => {
    if (modules[key]) {
      shader = shader.replace(new RegExp(key, 'g'), `${modules[key]} \n`);
    }
  });
  return shader;
}

/**
 * create shader and compile shader
 * @param gl
 * @param type
 * @param source
 * @returns {WebGLShader}
 */
export function createShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string,
): WebGLShader {
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
export function createProgram(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram | null {
  // create the shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const program = gl.createProgram();
  if (program !== null) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || '');
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
export function createTexture(
  gl: WebGLRenderingContext,
  filter: GLint,
  data: TexImageSource | Uint8Array,
  width: number,
  height: number,
): WebGLTexture | null {
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
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    );
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
export function bindTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  unit: number,
) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

/**
 * delete texture
 * @param gl
 * @param texture
 */
export function destroyTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
) {
  gl.deleteTexture(texture);
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
export function bindAttribute(
  gl: WebGLRenderingContext,
  buffer: WebGLBuffer,
  attribute: GLuint,
  numComponents: GLint,
) {
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
export function bindFramebuffer(
  gl: WebGLRenderingContext,
  framebuffer: WebGLFramebuffer,
  texture: WebGLTexture,
) {
  // 创建一个帧缓冲
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    // 绑定纹理到帧缓冲
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
  }
}

/**
 * clear scene
 * @param gl
 * @param color
 */
export function clearScene(gl: WebGLRenderingContext, color: number[]) {
  const [r, g, b, a] = color;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(r, g, b, a);
  gl.clearDepth(1);
  // tslint:disable-next-line:no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
}

/**
 * load image by url
 * @param src
 * @returns {Promise<Image>}
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
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
  });
}

export interface IPlaneBuffer {
  uvs: {
    data: number[];
    size: number;
  };
  elements: {
    data: number[];
    count: number;
  };
  wireframeElements: {
    data: number[];
    count: number;
  };
  position: {
    data: number[];
    size: number;
  };
  positionLow: {
    data: number[];
    size: number;
  };
}

export function getPlaneBuffer(
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  widthSegments: number,
  heightSegments: number,
): IPlaneBuffer {
  const width = endX - startX;
  const height = endY - startY;
  const widthHalf = width / 2;
  const heightHalf = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  const indices = [];
  const wireframeIndexes = [];
  const vertices = [];
  const verticesLow = [];
  const uvs = [];

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight;
    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth;
      const vx = startX + (x / widthHalf / 2) * width;
      const vy = startY + (y / heightHalf / 2) * height;
      vertices.push(vx, vy, 0);
      verticesLow.push(fp64LowPart(vx), fp64LowPart(vy), 0);
      // vertices.push(ix / gridX, 1 - (iy / gridY));
      uvs.push(ix / gridX, iy / gridY);
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  for (let i = 0, l = indices.length; i < l; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];
    wireframeIndexes.push(a, b, b, c, c, a);
  }

  return {
    uvs: {
      data: uvs,
      size: 2,
    },
    elements: {
      data: indices,
      count: indices.length,
    },
    wireframeElements: {
      data: wireframeIndexes,
      count: wireframeIndexes.length,
    },
    position: {
      data: vertices,
      size: 3,
    },
    positionLow: {
      data: verticesLow,
      size: 3,
    },
  };
}

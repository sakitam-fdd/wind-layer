precision mediump float;

// 从顶点着色器中传入
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}

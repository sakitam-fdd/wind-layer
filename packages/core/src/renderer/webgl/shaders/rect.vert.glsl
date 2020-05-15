attribute vec2 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;
varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
  // 将颜色传递给片断着色器
  v_color = a_color;
}

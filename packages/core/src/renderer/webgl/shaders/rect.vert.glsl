attribute vec2 a_position;
attribute vec4 a_color;

//uniform mat4 u_matrix;
uniform vec2 u_resolution;
varying vec4 v_color;
uniform float u_pointSize;

void main() {
  // convert the rectangle from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  // 未翻转Y轴
  //  gl_Position = vec4(a_position, 0, 1);
  // 翻转Y轴
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  // Multiply the position by the matrix.
//  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
  // 将颜色传递给片断着色器
  v_color = a_color;

  gl_PointSize = u_pointSize;
}

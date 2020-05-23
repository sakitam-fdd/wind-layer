uniform mat4 u_matrix;

attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform float u_dateline_offset;

varying vec2 v_tex_pos;// the position in the texture to find

void main () {
  gl_Position = u_matrix * vec4(a_position.xy + vec2(u_dateline_offset, 0), 0.0, 1.0);
  v_tex_pos = a_texCoord;
}

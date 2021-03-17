uniform mat4 u_matrix;
uniform vec4 u_cameraEye;
uniform vec4 u_cameraEye64Low;
uniform float u_offset;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec2 a_texCoord;

varying vec2 v_tex_pos;// the position in the texture to find

void main () {
  vec4 pos = vec4(instancePositions - u_cameraEye.xyz, 0.0);
  pos += vec4(instancePositions64Low - u_cameraEye64Low.xyz, 0.0);
  gl_Position = u_matrix * vec4(pos.xy + vec2(u_offset, 0.0), pos.zw);
  gl_Position.w += u_cameraEye.w;
  v_tex_pos = a_texCoord;
}

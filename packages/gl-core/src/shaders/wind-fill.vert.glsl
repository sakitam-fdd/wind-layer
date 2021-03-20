#define PI 3.141592653589793

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform vec4 u_cameraEye;
uniform vec4 u_cameraEye64Low;
uniform float u_offset;

uniform sampler2D u_wind;
uniform vec2 u_image_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform vec2 u_mapping_range;

varying vec2 v_tex_pos;// the position in the texture to find
varying float v_value;

const float earthRadius = 6371008.8;
const float earthCircumfrence = 2.0 * PI * earthRadius;

vec2 windTexture(const vec2 uv) {
  return texture2D(u_wind, uv).rg;
}

float bilinearU(const vec2 uv) {
  vec2 px = 1.0 / u_image_res;
  // floor 向下取整
  vec2 vc = (floor(uv * u_image_res)) * px;
  // fract 返回小数部分
  vec2 f = fract(uv * u_image_res);
  float tl = windTexture(vc).r;
  float tr = windTexture(vc + vec2(px.x, 0)).r;
  float bl = windTexture(vc + vec2(0, px.y)).r;
  float br = windTexture(vc + px).r;
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

float bilinearV(const vec2 uv) {
  vec2 px = 1.0 / u_image_res;
  // floor 向下取整
  vec2 vc = (floor(uv * u_image_res)) * px;
  // fract 返回小数部分
  vec2 f = fract(uv * u_image_res);
  float tl = windTexture(vc).g;
  float tr = windTexture(vc + vec2(px.x, 0.0)).g;
  float bl = windTexture(vc + vec2(0.0, px.y)).g;
  float br = windTexture(vc + px).g;
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

float getV(const vec2 uv) {
  float min = u_wind_min.y;
  float max = u_wind_max.y;
  float r = bilinearV(uv);
  return r * (max - min) + min;
}

float getU(const vec2 uv) {
  float min = u_wind_min.x;
  float max = u_wind_max.x;
  float r = bilinearU(uv);
  return r * (max - min) + min;
}

float windSpeed(const vec2 uv) {
  float u = getU(uv);
  float v = getV(uv);
  float min = u_mapping_range.x;
  float max = u_mapping_range.y;
  float val = length(vec2(u, v));
  return val * (max - min) + min;
}

#pragma glslify: mercatorToWGS84 = require(./mercatorToWGS84)


float latFromMercatorY(float y) {
  float y2 = 180.0 - y * 360.0;
  return 360.0 / PI * atan(exp(y2 * PI / 180.0)) - 90.0;
}

float circumferenceAtLatitude(float latitude) {
  return earthCircumfrence * cos(latitude * PI / 180.0);
}

float mercatorScale(float lat) {
  return 1.0 / cos(lat * PI / 180.0);
}

void main () {
  v_tex_pos = a_texCoord;
  vec2 globalWGS84 = mercatorToWGS84(v_tex_pos);
  float value = windSpeed(globalWGS84);

  float mercatorY = instancePositions.y;
  //  float scale = circumferenceAtLatitude(latFromMercatorY(mercatorY));
  float scale = earthCircumfrence * mercatorScale(latFromMercatorY(mercatorY));

  vec4 pos = vec4(instancePositions - u_cameraEye.xyz, 0.0);
  pos += vec4(instancePositions64Low - u_cameraEye64Low.xyz, 0.0);
  gl_Position = u_matrix * vec4(pos.xy + vec2(u_offset, 0.0), pos.z + (value / scale), pos.w);
  gl_Position.w += u_cameraEye.w;
}

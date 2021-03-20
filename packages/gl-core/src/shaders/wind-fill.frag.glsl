precision highp float;

uniform sampler2D u_wind;
uniform sampler2D u_color_ramp;

uniform vec2 u_image_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;

uniform vec2 u_color_range;
uniform vec2 u_display_range;
uniform float u_opacity;

varying vec2 v_tex_pos;

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
  return length(vec2(u, v));
}

#pragma glslify: mercatorToWGS84 = require(./mercatorToWGS84)

void main () {
  vec2 globalWGS84 = mercatorToWGS84(v_tex_pos);
  float value = windSpeed(globalWGS84);
  float value_t = (value - u_color_range.x) / (u_color_range.y - u_color_range.x);
  // color ramp is./ encoded in a 16x16 texture
  vec2 ramp_pos = vec2(fract(16.0 * value_t), floor(16.0 * value_t) / 16.0);

  vec4 color = texture2D(u_color_ramp, ramp_pos);

  bool display = value < u_display_range.y && value > u_display_range.x;

  if (display) {
    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}

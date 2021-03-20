precision highp float;

uniform sampler2D u_image;
uniform sampler2D u_color_ramp;

uniform vec2 u_image_res;
uniform vec2 u_range;
uniform vec2 u_color_range;
uniform vec2 u_display_range;
uniform float u_opacity;

varying vec2 v_tex_pos;

// 单通道返回的是浮点数或者整数
float calcTexture(const vec2 uv) {
  return texture2D(u_image, uv).r;
}

float bilinear(const vec2 uv) {
  vec2 px = 1.0 / u_image_res;
  // floor 向下取整
  vec2 vc = (floor(uv * u_image_res)) * px;
  // fract 返回小数部分
  vec2 f = fract(uv * u_image_res);
  float tl = calcTexture(vc);
  float tr = calcTexture(vc + vec2(px.x, 0));
  float bl = calcTexture(vc + vec2(0, px.y));
  float br = calcTexture(vc + px);
  // mix(x, y, a): x * (1-a) + y * a // 第三个参数恒为float
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

float getValue(const vec2 uv) {
  float min = u_range.x;
  float max = u_range.y;
  float r = bilinear(uv);
  return r * (max - min) + min;
}

#pragma glslify: mercatorToWGS84 = require(./mercatorToWGS84)

void main () {
  vec2 globalWGS84 = mercatorToWGS84(v_tex_pos);
  float value = getValue(globalWGS84);
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

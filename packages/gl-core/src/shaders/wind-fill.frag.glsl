#pragma glslify: mercatorToWGS84 = require(./mercatorToWGS84)

precision mediump float;

uniform sampler2D u_wind;
uniform sampler2D u_color_ramp;

uniform vec2 u_wind_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform float u_opacity;

varying vec2 v_tex_pos;// the position in the texture to find

vec2 windTexture(const vec2 uv) {
  return texture2D(u_wind, uv).rg;
}

vec2 bilinearWind(const vec2 uv) {
  // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
  vec2 px = 1.0 / u_wind_res;
  vec2 vc = (floor(uv * u_wind_res)) * px;
  vec2 f = fract(uv * u_wind_res);
  vec2 tl = windTexture(vc);
  vec2 tr = windTexture(vc + vec2(px.x, 0));
  vec2 bl = windTexture(vc + vec2(0, px.y));
  vec2 br = windTexture(vc + px);
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

vec2 windSpeed(const vec2 uv) {
  return mix(u_wind_min, u_wind_max, bilinearWind(uv));
}

float windSpeedMagnitude(const vec2 uv) {
  return length(windSpeed(uv)) / length(u_wind_max);
}

void main () {
  vec2 globalWGS84 = mercatorToWGS84(v_tex_pos);
  float speed_t = windSpeedMagnitude(globalWGS84);
  // color ramp is./ encoded in a 16x16 texture
  vec2 ramp_pos = vec2(
  fract(16.0 * speed_t),
  floor(16.0 * speed_t) / 16.0);

  vec4 color = texture2D(u_color_ramp, ramp_pos);

  gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
  //    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
}

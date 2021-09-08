precision highp float;

uniform sampler2D u_wind;
uniform sampler2D u_particles;

uniform vec2 u_wind_res;
uniform float u_rand_seed;

uniform vec4 u_wind_range;

uniform float u_drop_rate;
uniform float u_drop_rate_bump;
uniform vec2 u_speed_factor;

varying vec2 v_tex_pos;

#pragma glslify: toRGBA = require(../encode)
#pragma glslify: fromRGBA = require(../decode)
#pragma glslify: rand = require(../random)
//#pragma glslify: mercatorToWGS84 = require(../mercatorToWGS84)

vec2 decodeValue(sampler2D tex, const vec2 uv) {
    vec4 color = texture2D(tex, uv);

    float u = u_wind_range[0] + ((u_wind_range[2] - u_wind_range[0]) * color.r);
    float v = u_wind_range[1] + ((u_wind_range[3] - u_wind_range[1]) * color.g);

    return vec2(u, v);
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_wind(const vec2 uv) {
  // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
  vec2 px = 1.0 / u_wind_res;
  vec2 vc = (floor(uv * u_wind_res)) * px;
  vec2 f = fract(uv * u_wind_res);
  vec2 tl = decodeValue(u_wind, vc);
  vec2 tr = decodeValue(u_wind, vc + vec2(px.x, 0));
  vec2 bl = decodeValue(u_wind, vc + vec2(0, px.y));
  vec2 br = decodeValue(u_wind, vc + px);
  // mix(x, y, level)
  // dest = x * (1 - level) + y * level;
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {
    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 pos = fromRGBA(color);

    vec2 velocity = lookup_wind(pos);

    float speed_t = length(velocity);
    vec2 offset =  vec2(velocity.x, -velocity.y) * u_speed_factor;
    // 更新粒子位置
    pos = fract(1.0 + pos + offset);

    // a random seed to use for the particle drop
    vec2 seed = (pos + v_tex_pos) * u_rand_seed;
    // 抛弃率是粒子在随机位置重新启动的机会，以避免退化
    float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    pos = mix(pos, random_pos, drop);

    gl_FragColor = toRGBA(pos);
}

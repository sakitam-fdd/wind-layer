precision highp float;

uniform sampler2D u_wind;
uniform vec2 u_wind_res;
uniform vec4 u_wind_range;
uniform vec2 u_color_range;
uniform sampler2D u_color_ramp;

varying vec2 v_particle_pos;

vec2 decodeValue(const vec2 uv) {
    vec4 u_color = texture2D(u_wind, uv);
    float u = u_wind_range[0] + ((u_wind_range[1] - u_wind_range[0]) * (u_color.r * 255.0 - 1.0)) / 254.0;
    float v = u_wind_range[2] + ((u_wind_range[3] - u_wind_range[2]) * (u_color.g * 255.0 - 1.0)) / 254.0;

    return vec2(u, v);
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_wind(const vec2 uv) {
    // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(uv * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = decodeValue(vc);
    vec2 tr = decodeValue(vc + vec2(px.x, 0));
    vec2 bl = decodeValue(vc + vec2(0, px.y));
    vec2 br = decodeValue(vc + px);
    // mix(x, y, level)
    // dest = x * (1 - level) + y * level;
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {
    vec2 velocity = lookup_wind(v_particle_pos);
    float speed_t = length(velocity);

    float value_t = (speed_t - u_color_range.x) / (u_color_range.y - u_color_range.x);
    // color ramp is./ encoded in a 16x16 texture
    vec2 ramp_pos = vec2(fract(16.0 * value_t), floor(16.0 * value_t) / 16.0);

    vec4 color = texture2D(u_color_ramp, ramp_pos);
    gl_FragColor = vec4(floor(255.0 * color * color.a) / 255.0);
}

precision mediump float;

uniform sampler2D u_particles;
uniform sampler2D u_wind;
uniform vec2 u_wind_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform float u_rand_seed;
uniform vec2 u_speed_factor;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;
uniform bool u_initialize;

uniform vec4 u_bbox;
uniform vec4 u_data_bbox;

varying vec2 v_tex_pos;

// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

vec4 calcTexture(const vec2 puv) {
    return texture2D(u_wind, puv);
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_wind(const vec2 uv) {
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(uv * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = calcTexture(vc).rg;
    vec2 tr = calcTexture(vc + vec2(px.x, 0)).rg;
    vec2 bl = calcTexture(vc + vec2(0, px.y)).rg;
    vec2 br = calcTexture(vc + px).rg;
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

vec2 randomPosToGlobePos(vec2 pos) {
    vec2 min_bbox = u_bbox.xy;
    vec2 max_bbox = u_bbox.zw;
    return mix(min_bbox, max_bbox, pos);
}

float wrapx(float x) {
    return mod(x + 1.0, 1.0);
}

float wrapx(float x, float min) {
    float wrappedX = wrapx(x);
    if (wrappedX < min) {
        wrappedX += 1.0;
    }
    return wrappedX;
}

bool containsXY(vec2 pos, vec4 bbox) {
    float x = wrapx(pos.x, bbox.x);
    //    float x = pos.x;
    return (
    bbox.x <= x && x <= bbox.z &&
    bbox.y <= pos.y && pos.y <= bbox.w
    );
}

vec2 update(vec2 pos) {
    vec2 uv = (pos.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy); // 0-1

    vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(uv));
    float speed_t = length(velocity) / length(u_wind_max);

    vec2 offset = vec2(velocity.x , -velocity.y) * 0.0001 * u_speed_factor;

    pos = pos + offset;
    // a random seed to use for the particle drop
    vec2 seed = (pos + v_tex_pos) * u_rand_seed;
    // drop rate is a chance a particle will restart at random position, to avoid degeneration
    float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    random_pos = randomPosToGlobePos(random_pos);

    if (!containsXY(pos.xy, u_data_bbox) || !containsXY(pos.xy, u_bbox) || calcTexture(uv).a == 0.0) {
        drop = 1.0;
    }

    return mix(pos, random_pos, drop);
}

void main() {
    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 pos = color.rg; // decode particle position from pixel RGBA

    pos = update(pos);
    if (u_initialize) {
        for (int i = 0; i < 100; i++) {
            pos = update(pos);
        }
    }
    // encode the new particle position back into RGBA
    gl_FragColor = vec4(pos, 0.0, 1.0);
}

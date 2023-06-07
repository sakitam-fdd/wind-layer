#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;

uniform sampler2D u_particles;

uniform float u_fade_t;
uniform vec2 u_image_res;

uniform vec4 u_bbox;
uniform vec4 u_data_bbox;
uniform float u_rand_seed;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;
uniform float u_speed_factor;

varying vec2 vUv;

#include <random>

vec4 calcTexture(const vec2 puv) {
    vec4 color0 = texture2D(u_texture, puv);
    vec4 color1 = texture2D(u_textureNext, puv);

    return mix(color0, color1, u_fade_t);
}

vec2 decodeValue(const vec2 vc) {
    vec4 rgba = calcTexture(vc);
    return rgba.rg;
}

vec2 bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    vec2 tl = decodeValue(vc);
    vec2 tr = decodeValue(vc + vec2(px.x, 0));
    vec2 bl = decodeValue(vc + vec2(0, px.y));
    vec2 br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

const vec4 drop_pos = vec4(0);

bool containsXY(vec2 pos, vec4 bbox) {
    return (
        bbox.x <= pos.x && pos.x <= bbox.z &&
        bbox.y <= pos.y && pos.y <= bbox.w
    );
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;
    vec2 uv = u_bbox.xy + pos * (u_bbox.zw - u_bbox.xy);

    // 如果是无数据，直接赋值为初始值
    if (calcTexture(uv).a == 0.0) {
        discard;
    }

    vec2 velocity = bilinear(uv);

    float speed = length(velocity);

    vec2 offset = vec2(velocity.x, -velocity.y) * 0.0001 * u_speed_factor;

    // update particle position, wrapping around the date line

    pos = fract(1.0 + pos + offset);

    // a random seed to use for the particle drop

    vec2 seed = (pos + vUv) * u_rand_seed;

    float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));
    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    pos = mix(pos, random_pos, drop);

    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

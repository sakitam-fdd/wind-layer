#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;

// 由于使用四通道来保存位置信息，需要两个 fbo 来存储 xy 位置
uniform sampler2D u_particles;

uniform float u_fade_t;
uniform vec2 u_image_res;

uniform vec4 u_bbox;
uniform mat4 u_data_matrix;
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

#if RENDER_TYPE == 1
// rg
vec2 decodeValue(const vec2 vc) {
    vec4 rgba = calcTexture(vc);
    return rgba.rg;
}
#else
float decodeValue(const vec2 vc) {
    return calcTexture(vc).r;
}
#endif

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

vec2 transformData(vec2 pos, mat4 matrix) {
    vec4 transformed = matrix * vec4(pos.xy, 1.0, 1.0);
    return transformed.xy / transformed.w;
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;

    vec2 uv = pos;

//    uv = vec2(u_bbox.x + (uv.x * u_bbox.z), u_bbox.y + (uv.y * u_bbox.w));
    uv = transformData(uv, u_data_matrix);

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

#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;

uniform sampler2D u_particles;

uniform float u_fade_t;
uniform vec2 u_image_res;

uniform vec4 u_bbox; // 当前地图范围
uniform vec4 u_data_bbox; // 数据范围
uniform float u_rand_seed;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;
uniform float u_speed_factor;
uniform bool u_initialize;

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

// 根据随机的位置计算在地图视图范围内的位置，我们要根据这些位置从数据纹理取值
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
    return (
    bbox.x <= x && x <= bbox.z &&
    bbox.y <= pos.y && pos.y <= bbox.w
    );
}

vec2 update(vec2 pos) {
    // 1. xy 必定在 bbox 内
    vec2 uv = (pos.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy); // 0-1

    vec2 velocity = bilinear(uv);

    float speed = length(velocity);

    vec2 offset = vec2(velocity.x, -velocity.y) * 0.0001 * u_speed_factor;

    pos = pos + offset;

    // a random seed to use for the particle drop

    // a random seed to use for the particle drop
    vec2 seed = (pos.xy + vUv) * u_rand_seed;

    float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));
    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    random_pos = randomPosToGlobePos(random_pos);

    if (!containsXY(pos.xy, u_data_bbox) || !containsXY(pos.xy, u_bbox) || calcTexture(uv).a == 0.0) {
        drop = 1.0;
    }

    pos = mix(pos, random_pos, drop);
    pos.x = wrapx(pos.x);

    return pos;
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;

    pos = update(pos);
    // 初始化时为避免粒子随机位置接近，先执行 25 次迭代
//    if (u_initialize) {
//        for (int i = 0; i < 25; i++) {
//            pos = update(pos);
//        }
//    }

    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

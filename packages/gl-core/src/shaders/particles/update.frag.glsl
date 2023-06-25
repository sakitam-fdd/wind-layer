#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;

uniform sampler2D u_particles;

uniform float u_fade_t;
uniform vec2 u_image_res;

uniform vec4 u_bbox; // 当前地图范围
uniform vec4 u_data_bbox; // 数据范围
uniform float u_rand_seed; // 这是一个传入的随机数
uniform float u_drop_rate;
uniform float u_drop_rate_bump;
uniform float u_speed_factor;

uniform float u_num_particles;
uniform float u_max_age;

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

const vec2 drop_pos = vec2(0.0);

bool containsXY(vec2 pos, vec4 bbox) {
    return (
        bbox.x <= pos.x && pos.x <= bbox.z &&
        bbox.y <= pos.y && pos.y <= bbox.w
    );
}

// 根据随机的位置计算在地图视图范围内的位置，我们要根据这些位置从数据纹理取值
vec2 randomPosToGlobePos(vec2 pos) {
    vec2 min_bbox = u_bbox.xy;
    vec2 max_bbox = u_bbox.zw;
    return mix(min_bbox, max_bbox, pos);
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;
    vec2 uv = (pos.xy - u_bbox.xy) * (u_bbox.zw - u_bbox.xy); // 0-1

    // 如果原始位置不在数据范围内，那么丢弃此粒子
    if (!containsXY(pos.xy, u_data_bbox)) {
//        gl_FragColor = vec4(drop_pos, 0.0, 1.0);
//        return;
    }

    // 如果原始位置不在地图范围内，那么丢弃此粒子
    if (!containsXY(pos.xy, u_bbox)) {
//        gl_FragColor = vec4(drop_pos, 0.0, 1.0);
//        return;
    }

    // 如果是无数据，直接赋值为初始值
    if (calcTexture(uv).a == 0.0) {
//        gl_FragColor = vec4(drop_pos, 0.0, 1.0);
//        return;
    }

    vec2 velocity = bilinear(uv);

    float speed = length(velocity);

    vec2 offset = vec2(velocity.x, -velocity.y) * 0.0001 * u_speed_factor;

    pos = pos + offset;

    vec2 seed = pos * u_rand_seed;

    float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));
    random_pos = randomPosToGlobePos(random_pos);
    pos = mix(pos, random_pos, drop);

    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

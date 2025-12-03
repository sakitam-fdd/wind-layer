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
uniform bool u_flip_y;
uniform float u_gl_scale;

varying vec2 vUv;

// Flag to control whether particles should be dropped during update.
// During initialization spreading, we don't want to drop particles.
bool g_allow_drop = true;

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

// Map random 0-1 position to the DATA bounds (not viewport bounds).
// This ensures particles are uniformly distributed across the actual data coverage area,
// preventing clustering when viewport and data bounds differ.
vec2 randomPosToDataPos(vec2 pos) {
    vec2 min_bbox = u_data_bbox.xy;
    vec2 max_bbox = u_data_bbox.zw;
    return mix(min_bbox, max_bbox, pos);
}

// Legacy function kept for compatibility - maps to viewport bounds
vec2 randomPosToGlobePos(vec2 pos) {
    vec2 min_bbox = u_bbox.xy;
    vec2 max_bbox = u_bbox.zw;
    return mix(min_bbox, max_bbox, pos);
}

bool containsXY(vec2 pos, vec4 bbox) {
    float x = pos.x;
    return (
    bbox.x <= x && x <= bbox.z &&
    bbox.y <= pos.y && pos.y <= bbox.w
    );
}

vec2 update(vec2 pos) {
    // 1. xy 必定在 bbox 内
    vec2 uv = (pos.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy); // 0-1

    if (u_flip_y) {
        uv = vec2(uv.x, 1.0 - uv.y);
    }

    vec2 velocity = bilinear(uv);

    float speed = length(velocity);

    vec2 v = vec2(velocity.x, -velocity.y);

    if (u_flip_y) {
        v = vec2(velocity.x, velocity.y);
    }

    vec2 offset = v * 0.0001 * u_speed_factor * u_gl_scale;

    pos = pos + offset;

    // Skip drop logic if dropping is disabled (during initialization spread)
    if (!g_allow_drop) {
        return pos;
    }

    // a random seed to use for the particle drop
    vec2 seed = (pos.xy + vUv) * u_rand_seed;

    float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    // Generate random position within DATA bounds (not viewport bounds).
    // This ensures dropped particles respawn uniformly across the data area.
    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));
    random_pos = randomPosToDataPos(random_pos);

    if (!containsXY(pos.xy, u_data_bbox) || !containsXY(pos.xy, u_bbox) || calcTexture(uv).a == 0.0) {
        drop = 1.0;
    }

    pos = mix(pos, random_pos, drop);

    return pos;
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;

    // During initialization, map random positions to DATA bounds for uniform distribution.
    // This prevents clustering where data and viewport bounds differ.
    if (u_initialize) {
        // Convert initial random 0-1 position (scaled by glScale) back to 0-1 range,
        // then map to data bounds for uniform coverage.
        vec2 normalized_pos = pos / u_gl_scale;
        pos = randomPosToDataPos(normalized_pos);

        // During initialization spreading, disable dropping so particles stay
        // uniformly distributed. The drop logic would cause particles in areas
        // without data to cluster in areas with data.
        g_allow_drop = false;

        // Run a few iterations to add slight movement variation, but not enough
        // to significantly redistribute particles.
        for (int i = 0; i < 5; i++) {
            pos = update(pos);
        }

        // Re-enable dropping for normal operation
        g_allow_drop = true;
    } else {
        pos = update(pos);
    }

    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

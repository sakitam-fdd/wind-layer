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
    // Convert particle position to UV coordinates relative to data bounds
    vec2 uv = (pos.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy); // 0-1

    if (u_flip_y) {
        uv = vec2(uv.x, 1.0 - uv.y);
    }

    // Only sample velocity if particle is within data bounds.
    // Particles outside data bounds stay stationary (velocity = 0).
    vec2 velocity = vec2(0.0);
    float speed = 0.0;
    bool inDataBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;

    if (inDataBounds) {
        velocity = bilinear(uv);
        speed = length(velocity);

        vec2 v = vec2(velocity.x, -velocity.y);

        if (u_flip_y) {
            v = vec2(velocity.x, velocity.y);
        }

        vec2 offset = v * 0.0001 * u_speed_factor * u_gl_scale;
        pos = pos + offset;
    }

    // Skip drop logic if dropping is disabled (during initialization spread)
    if (!g_allow_drop) {
        return pos;
    }

    // a random seed to use for the particle drop
    vec2 seed = (pos.xy + vUv) * u_rand_seed;

    float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    // Generate random position within VIEWPORT bounds (u_bbox).
    // This ensures particles respawn uniformly across the entire visible area,
    // not just the area with loaded data tiles.
    vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));
    random_pos = randomPosToGlobePos(random_pos);

    // Only force-drop particles that have moved outside the VIEWPORT bounds.
    // Do NOT drop particles just because they're outside data bounds - they should
    // stay in place (invisible) until they naturally drop and respawn.
    if (!containsXY(pos.xy, u_bbox)) {
        drop = 1.0;
    }

    pos = mix(pos, random_pos, drop);

    return pos;
}

void main() {
    vec2 pos = texture2D(u_particles, vUv).xy;

    // During initialization, map random positions to VIEWPORT bounds (u_bbox).
    // We use viewport bounds instead of data bounds because:
    // 1. Data bounds (u_data_bbox) only covers currently loaded tiles
    // 2. After a pan, not all tiles may be loaded yet
    // 3. Using viewport bounds ensures particles are distributed across the entire view
    // 4. Particles in areas without data will be invisible but won't cluster
    if (u_initialize) {
        // Convert initial random 0-1 position (scaled by glScale) back to 0-1 range,
        // then map to viewport bounds for uniform coverage across the visible area.
        vec2 normalized_pos = pos / u_gl_scale;
        pos = randomPosToGlobePos(normalized_pos);

        // Don't call update() during initialization - just set the random position.
        // Calling update() would sample velocity from potentially incomplete data texture,
        // causing particles to drift toward areas with loaded data.
    } else {
        pos = update(pos);
    }

    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

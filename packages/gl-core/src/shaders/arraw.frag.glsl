#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;
uniform sampler2D colorRampTexture;
uniform float u_fade_t;

uniform vec2 u_image_res;
uniform vec2 colorRange;
uniform bool useDisplayRange;
uniform vec2 displayRange;
uniform float opacity;

varying vec2 vUv;

#include <mercatorToWGS84>

vec4 calcTexture(const vec2 puv) {
    vec4 color0 = texture2D(u_texture, puv);
    vec4 color1 = texture2D(u_textureNext, puv);

    return mix(color0, color1, u_fade_t);
}

// rg
vec2 decodeValue(const vec2 vc) {
    vec4 rgba = calcTexture(vc);
    return rgba.rg;
}

vec2 bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    vec2 tl = decodeValue(vc);
    vec2 tr = decodeValue(vc + vec2(px.x, 0.0));
    vec2 bl = decodeValue(vc + vec2(0.0, px.y));
    vec2 br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

float getValue(vec2 rg) {
    return length(rg);
}

float getAngle(vec2 rg) {
    float angle = atan(rg.x, rg.y);
    angle -= PI / 2.0;

    return angle;
}

// 2D vector field visualization by Matthias Reitinger, @mreitinger
// Based on "2D vector field visualization by Morgan McGuire, http://casual-effects.com", https://www.shadertoy.com/view/4s23DG

float ARROW_TILE_SIZE = 1.0 / 20.0;

// Computes the center pixel of the tile containing pixel pos
vec2 arrowTileCenterCoord(vec2 pos) {
    return (floor(pos / ARROW_TILE_SIZE) + 0.5) * ARROW_TILE_SIZE;
}

// Computes the signed distance from a line segment
float line(vec2 p, vec2 p1, vec2 p2) {
    vec2 center = (p1 + p2) * 0.5;
    float len = length(p2 - p1);
    vec2 dir = (p2 - p1) / len;
    vec2 rel_p = p - center;
    float dist1 = abs(dot(rel_p, vec2(dir.y, -dir.x)));
    float dist2 = abs(dot(rel_p, dir)) - 0.5*len;
    return max(dist1, dist2);
}

// v = field sampled at arrowTileCenterCoord(p), scaled by the length
// desired in pixels for arrows
// Returns a signed distance from the arrow
float arrow(vec2 p, vec2 v) {
    // Make everything relative to the center, which may be fractional
    p -= arrowTileCenterCoord(p);

    float mag_v = length(v), mag_p = length(p);

    if (mag_v > 0.0) {
        // Non-zero velocity case
        vec2 dir_v = v / mag_v;

        // We can't draw arrows larger than the tile radius, so clamp magnitude.
        // Enforce a minimum length to help see direction
        mag_v = clamp(mag_v, 5.0, ARROW_TILE_SIZE * 0.5);

        // Arrow tip location
        v = dir_v * mag_v;

        // Signed distance from shaft
        float shaft = line(p, v, -v);
        // Signed distance from head
        float head = min(line(p, v, 0.4*v + 0.2*vec2(-v.y, v.x)),
        line(p, v, 0.4*v + 0.2*vec2(v.y, -v.x)));

        return min(shaft, head);
    } else {
        // Signed distance from the center point
        return mag_p;
    }
}

void main() {
    vec2 uv = vUv;
    #ifdef USE_WGS84
    uv = mercatorToWGS84(vUv);
    #endif
    if(calcTexture(uv).a == 0.0) {
        discard;
    }
    vec2 rg = bilinear(uv);
    float value = getValue(rg);
    float value_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(colorRampTexture, ramp_pos);

    float arrow_dist = arrow(uv, bilinear(arrowTileCenterCoord(uv)) * ARROW_TILE_SIZE * 0.4);
    vec4 arrow_col = vec4(0.0, 0.0, 0.0, clamp(arrow_dist, 0.0, 1.0));
    vec4 field_col = vec4(bilinear(uv) * 0.5 + 0.5, 0.5, 1.0);

    gl_FragColor = mix(arrow_col, field_col, arrow_col.a);

//    gl_FragColor = color;
//    gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
}

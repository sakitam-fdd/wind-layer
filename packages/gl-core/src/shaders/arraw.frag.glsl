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

// https://www.shadertoy.com/view/NdlBRM
// https://www.shadertoy.com/view/dssyzf
// https://www.shadertoy.com/view/dtcXDM
// https://www.shadertoy.com/view/ldlSWj
// https://github.com/vispy/vispy/blob/main/vispy/glsl/antialias/filled.glsl

vec4 filled(float distance, float linewidth, float antialias, vec4 fill) {
    vec4 frag_color = vec4(0.0);
    float t = linewidth / 2.0 - antialias;
    float signed_distance = distance;
    float border_distance = abs(signed_distance) - t;
    float alpha = border_distance / antialias;
    alpha = exp(-alpha * alpha);

    if(border_distance < 0.0) {
        // Within linestroke
        frag_color = fill;
    } else if(signed_distance < 0.0) {
        // Within shape
        frag_color = fill;
    }
    return frag_color;
}

// Computes the signed distance from a line
float line_distance(vec2 p, vec2 p1, vec2 p2) {
    vec2 center = (p1 + p2) * 0.5;
    float len = length(p2 - p1);
    vec2 dir = (p2 - p1) / len;
    vec2 rel_p = p - center;
    return dot(rel_p, vec2(dir.y, -dir.x));
}

// Computes the signed distance from a line segment
float segment_distance(vec2 p, vec2 p1, vec2 p2) {
    vec2 center = (p1 + p2) * 0.5;
    float len = length(p2 - p1);
    vec2 dir = (p2 - p1) / len;
    vec2 rel_p = p - center;
    float dist1 = abs(dot(rel_p, vec2(dir.y, -dir.x)));
    float dist2 = abs(dot(rel_p, dir)) - 0.5*len;
    return max(dist1, dist2);
}

float arrow_triangle(vec2 texcoord, float body, float head, float height, float linewidth, float antialias, float denom) {
    float w = linewidth / 2.0 + antialias;
    float r = denom;
    vec2 start = vec2(0.0, 0.0);//-vec2(body/r, 0.0);
    vec2 end   = +vec2(body*r, 0.0);
    head = head*r;
    // Head : 3 lines
    float d1 = line_distance(texcoord, end, end - head*vec2(+1.0,-height));
    float d2 = line_distance(texcoord, end - head*vec2(+1.0,+height), end);
    float d3 = texcoord.x - end.x + head;

    // Body : 1 segment
    float d4 = segment_distance(texcoord, start, end - vec2(linewidth,0.0));

    float d = min(max(max(d1, d2), -d3), d4);
    return d;
}

float arrow_triangle_60(vec2 texcoord, float body, float head, float linewidth, float antialias, float denom) {
    return arrow_triangle(texcoord, body, head, 0.5, linewidth, antialias, denom);
}

float arrow_stealth(vec2 texcoord, float body, float head, float linewidth, float antialias) {
    float w = linewidth / 2.0 + antialias;
    vec2 start = -vec2(body / 2.0, 0.0);
    vec2 end   = +vec2(body / 2.0, 0.0);
    float height = 0.5;

    // Head : 4 lines
    float d1 = line_distance(texcoord, end - head*vec2(+1.0, -height), end);
    float d2 = line_distance(texcoord, end - head*vec2(+1.0, -height), end - vec2(3.0 * head / 4.0, 0.0));
    float d3 = line_distance(texcoord, end - head*vec2(+1.0, +height), end);
    float d4 = line_distance(texcoord, end - head*vec2(+1.0, +0.5), end - vec2(3.0 * head / 4.0, 0.0));

    // Body : 1 segment
    float d5 = segment_distance(texcoord, start, end - vec2(linewidth,0.0));

    return min(d5, max( max(-d1, d3), - max(-d2,d4)));
}

const float linewidth = 2.5;
const float antialias =  .1;
float headSize = 0.1;
float bodySize = 1.0;

void main() {
    vec2 uv = vUv;
    #ifdef USE_WGS84
    uv = mercatorToWGS84(vUv);
    #endif
    if(calcTexture(uv).a == 0.0) {
        discard;
    }

    vec2 pos = vUv - vec2(0.0, 0.5);

    vec2 rg = bilinear(uv);
    float value = getValue(rg);
    float value_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(colorRampTexture, ramp_pos);

    float d = arrow_stealth(pos.xy, bodySize, headSize, linewidth, antialias);
//    float d = arrow_triangle_60(texcoord, body, 0.4*body, linewidth, antialias, denom);

    gl_FragColor = filled(d, linewidth, antialias, vec4(1.0, 1.0, 1.0, 1.0));

//    gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
}

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
#include <decodeFloat>

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

#if RENDER_TYPE == 1
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
#else
float bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    float tl = decodeValue(vc);
    float tr = decodeValue(vc + vec2(px.x, 0));
    float bl = decodeValue(vc + vec2(0, px.y));
    float br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}
#endif

#if RENDER_TYPE == 1
float getValue(const vec2 uv) {
    vec2 rg = bilinear(uv);
    return length(rg);
}
#else
// float
float getValue(const vec2 uv) {
    return bilinear(uv);
}
#endif

void main () {
    vec2 uv = vUv;
    #ifdef USE_WGS84
    uv = mercatorToWGS84(vUv);
    #endif
    if(calcTexture(uv).a == 0.0) {
        discard;
    }
    float value = getValue(uv);
    float value_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(colorRampTexture, ramp_pos);

    bool display = true;

    if (useDisplayRange) {
        display = value <= displayRange.y && value >= displayRange.x;
    }

    if (display) {
        gl_FragColor = vec4(floor(255.0 * color * opacity) / 255.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}

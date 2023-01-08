precision highp float;

#defines

uniform sampler2D u_texture;
uniform sampler2D colorRampTexture;

uniform vec2 u_image_res;
uniform vec2 u_range;
uniform vec2 colorRange;
uniform bool useDisplayRange;
uniform vec2 displayRange;
uniform float opacity;

varying vec2 vUv;

#include <mercatorToWGS84>
#include <decodeFloat>

vec4 calcTexture(const vec2 puv) {
    return texture2D(u_texture, puv);
}

float decodeValue(const vec2 vc) {
    return decode_float(calcTexture(vc), LITTLE_ENDIAN);
}

float getValue(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    float tl = decodeValue(vc);
    float tr = decodeValue(vc + vec2(px.x, 0));
    float bl = decodeValue(vc + vec2(0, px.y));
    float br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main () {
    vec2 uv = vUv;
    #ifdef USE_WGS84
    uv = mercatorToWGS84(vUv);
    #endif
//    if(texture2D(u_texture, uv) == 0.0) {
//        discard;
//    }
    float value = getValue(uv);
    float value_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(colorRampTexture, ramp_pos);

    bool display = true;

    if (useDisplayRange) {
        display = value < displayRange.y && value > displayRange.x;
    }

    if (display) {
        gl_FragColor = vec4(floor(255.0 * color * opacity) / 255.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}

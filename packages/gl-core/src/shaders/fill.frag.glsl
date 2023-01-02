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

#include <bilinear>
#include <mercatorToWGS84>

float getValue(const vec2 uv) {
    float min = u_range.x;
    float max = u_range.y;
    float r = bilinear(uv);
    return r * (max - min) + min;
}

void main () {
    vec2 uv = vUv;
    #ifdef USE_WGS84
    uv = mercatorToWGS84(vUv);
    #endif
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

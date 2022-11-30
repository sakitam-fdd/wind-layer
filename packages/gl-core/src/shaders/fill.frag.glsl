precision highp float;

#defines

uniform sampler2D u_image;
uniform sampler2D u_color_ramp;

uniform vec2 u_image_res;
uniform vec2 u_range;
uniform vec2 u_color_range;
uniform vec2 u_display_range;
uniform float u_opacity;

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
    vec2 globalWGS84 = mercatorToWGS84(vUv);
    float value = getValue(globalWGS84);
    float value_t = (value - u_color_range.x) / (u_color_range.y - u_color_range.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(u_color_ramp, ramp_pos);

    bool display = value < u_display_range.y && value > u_display_range.x;

    if (display) {
        gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}

#defines
precision highp float;

varying vec2 vUv;
uniform sampler2D u_image0;
uniform sampler2D u_image1;

#include <decodeFloat>

#if RENDER_TYPE == 1
uniform vec4 dataRange;

vec4 getColor(const vec2 uv) {
    vec2 rg = texture2D(u_image0, uv).rg;
    vec2 data = rg * (dataRange.yw - dataRange.xz) + dataRange.xz;
    return vec4(data.xy, 0.0, 1.0);
}

#elif RENDER_TYPE == 0
uniform vec2 dataRange;

vec4 getColor(const vec2 uv) {
    float r = texture2D(u_image0, uv).r;
    float rf = r * (dataRange.y - dataRange.x) + dataRange.x;
    return vec4(rf, 0.0, 0.0, 1.0);
}
#elif RENDER_TYPE == 2
vec4 getColor(const vec2 uv) {
    vec4 rgba = texture2D(u_image0, uv).rgba;
    float r = decode_float(rgba, LITTLE_ENDIAN);
    return vec4(r, 0.0, 0.0, 1.0);
}
#else
vec4 getColor(const vec2 uv) {
    return texture2D(u_image0, uv).rgba;
}
#endif

void main() {
    gl_FragColor = getColor(vUv);
}

#defines
precision highp float;

varying vec2 vUv;
uniform sampler2D u_image0;
uniform sampler2D u_image1;

#include <decodeFloat>

#if RENDER_TYPE == 1
uniform vec4 dataRange;

vec4 getColor(const vec2 uv) {
    vec4 texel = texture2D(u_image0, uv);
    vec2 rg = texel.rg;
    float alpha = texel.a;
    vec2 data = rg * (dataRange.yw - dataRange.xz) + dataRange.xz;
    // Preserve alpha from source texture - this allows masking of land/no-data areas
    return vec4(data.xy, 0.0, alpha);
}

#elif RENDER_TYPE == 0
uniform vec2 dataRange;

vec4 getColor(const vec2 uv) {
    vec4 texel = texture2D(u_image0, uv);
    float r = texel.r;
    float alpha = texel.a;
    float rf = r * (dataRange.y - dataRange.x) + dataRange.x;
    // Preserve alpha from source texture - this allows masking of land/no-data areas
    return vec4(rf, 0.0, 0.0, alpha);
}
#elif RENDER_TYPE == 2
vec4 getColor(const vec2 uv) {
    vec4 rgba = texture2D(u_image0, uv).rgba;
    float r = decode_float(rgba, LITTLE_ENDIAN);
    // For float-encoded data, use alpha=1 if we have valid data, 0 otherwise
    // This assumes rgba encoding uses all channels, so check if any channel has data
    float alpha = (rgba.r > 0.0 || rgba.g > 0.0 || rgba.b > 0.0 || rgba.a > 0.0) ? 1.0 : 0.0;
    return vec4(r, 0.0, 0.0, alpha);
}
#else
vec4 getColor(const vec2 uv) {
    return texture2D(u_image0, uv).rgba;
}
#endif

void main() {
    gl_FragColor = getColor(vUv);
}

const vec2 bitEnc = vec2(1.0, 255.0);
const vec2 bitDec = 1.0 / bitEnc;

// decode particle position from pixel RGBA
vec2 fromRGBA(const vec4 color) {
    vec4 rounded_color = floor(color * 255.0 + 0.5) / 255.0;
    float x = dot(rounded_color.rg, bitDec);
    float y = dot(rounded_color.ba, bitDec);
    return vec2(x, y);
}

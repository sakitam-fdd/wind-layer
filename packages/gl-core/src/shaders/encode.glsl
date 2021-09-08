const vec2 bitEnc = vec2(1.0, 255.0);
const vec2 bitDec = 1.0 / bitEnc;

vec4 toRGBA (const vec2 pos) {
    vec2 rg = bitEnc * pos.x;
    rg = fract(rg);
    rg -= rg.yy * vec2(1.0 / 255.0, 0.0);

    vec2 ba = bitEnc * pos.y;
    ba = fract(ba);
    ba -= ba.yy * vec2(1.0 / 255.0, 0.0);

    return vec4(rg, ba);
}

#pragma glslify: export(toRGBA)

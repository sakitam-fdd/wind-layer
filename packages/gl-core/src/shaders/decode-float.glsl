//https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl/18454838#18454838

// Denormalize 8-bit color channels to integers in the range 0 to 255.
vec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {
    vec4 bytes = vec4(inputFloats * 255.0);
    return (
        littleEndian
        ? bytes.abgr
        : bytes
    );
}

// https://stackoverflow.com/questions/63827836/is-it-possible-to-do-a-rgba-to-float-and-back-round-trip-and-read-the-pixels-in
float decode_float(vec4 v, bool littleEndian) {
    vec4 bits = floatsToBytes(v, littleEndian);
    float sign = mix(-1.0, 1.0, step(bits[3], 128.0));
    // note: the 0.1s here an there are voodoo related to precision
    float expo = floor(mod(bits[3] + 0.2, 128.0)) * 2.0 + floor((bits[2] + 0.2) / 128.0) - 127.0;
    float sig = bits[0] + bits[1] * 256.0 + floor(mod(bits[2] + 0.2, 128.0)) * 256.0 * 256.0;
    return sign * (1.0 + sig / 8388607.0) * pow(2.0, expo);
}

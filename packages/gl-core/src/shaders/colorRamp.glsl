vec4 colorRamp(float value, float size, sampler2D ramp) {
    float x = value;
    float s = 1.0 / size;
    x = floor((value / s) + 0.5) * s;
    x = value + 0.001;
    return texture2D(ramp, vec2(x, 0.5));
}

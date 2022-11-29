float bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    float tl = calcTexture(vc);
    float tr = calcTexture(vc + vec2(px.x, 0));
    float bl = calcTexture(vc + vec2(0, px.y));
    float br = calcTexture(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

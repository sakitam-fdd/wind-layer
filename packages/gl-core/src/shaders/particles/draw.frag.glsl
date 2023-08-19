#defines

precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;
uniform vec2 u_colorRange;
uniform sampler2D u_colorRamp;

uniform vec4 u_bbox;
uniform vec4 u_data_bbox;
uniform float u_fade_t;
uniform vec2 u_image_res;
uniform bool u_flip_y;
uniform float u_gl_scale;

varying vec2 v_particle_pos;

vec4 calcTexture(const vec2 puv) {
    vec4 color0 = texture2D(u_texture, puv);
    vec4 color1 = texture2D(u_textureNext, puv);

    return mix(color0, color1, u_fade_t);
}

#if RENDER_TYPE == 1
// rg
vec2 decodeValue(const vec2 vc) {
    vec4 rgba = calcTexture(vc);
    return rgba.rg;
}
#else
float decodeValue(const vec2 vc) {
    return calcTexture(vc).r;
}
#endif

vec2 bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    vec2 tl = decodeValue(vc);
    vec2 tr = decodeValue(vc + vec2(px.x, 0));
    vec2 bl = decodeValue(vc + vec2(0, px.y));
    vec2 br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

bool containsXY(vec2 pos, vec4 bbox) {
    float x = pos.x;
    return (
    bbox.x < x && x < bbox.z &&
    bbox.y < pos.y && pos.y < bbox.w
    );
}

void main() {
    vec2 pos = v_particle_pos;

    if (!containsXY(pos.xy, u_data_bbox) || !containsXY(pos.xy, u_bbox) || calcTexture(pos).a == 0.0) {
        discard;
    }

    vec2 velocity = bilinear(pos);

    float value = length(velocity);

    float value_t = (value - u_colorRange.x) / (u_colorRange.y - u_colorRange.x);
    vec2 ramp_pos = vec2(value_t, 0.5);

    vec4 color = texture2D(u_colorRamp, ramp_pos);

    float distance = length(2.0 * gl_PointCoord - 1.0);
    if (distance > 1.0) {
        discard;
    }

    gl_FragColor = vec4(floor(255.0 * color * color.a) / 255.0);
}

#defines

attribute vec2 uv;
attribute vec2 position;
attribute vec2 coords;

uniform vec2 arrowSize;
uniform float u_head;
uniform float u_antialias;

uniform vec2 resolution;
uniform vec2 pixelsToProjUnit;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;
uniform sampler2D colorRampTexture;
uniform float u_fade_t;

uniform vec2 u_image_res;
uniform vec2 colorRange;
uniform bool useDisplayRange;
uniform vec2 displayRange;
uniform vec4 u_bbox; // 当前地图范围
uniform vec4 u_data_bbox; // 数据范围

#include <mercatorToWGS84>

varying vec2 vUv;

varying float v_speed;
varying float v_speed_t;
varying float v_head;
varying float v_body;
varying float v_antialias;
varying float v_linewidth;

vec4 calcTexture(const vec2 puv) {
    vec4 color0 = texture2D(u_texture, puv);
    vec4 color1 = texture2D(u_textureNext, puv);

    return mix(color0, color1, u_fade_t);
}

// rg
vec2 decodeValue(const vec2 vc) {
    vec4 rgba = calcTexture(vc);
    return rgba.rg;
}

vec2 bilinear(const vec2 uv) {
    vec2 px = 1.0 / u_image_res;
    vec2 vc = (floor(uv * u_image_res)) * px;
    vec2 f = fract(uv * u_image_res);
    vec2 tl = decodeValue(vc);
    vec2 tr = decodeValue(vc + vec2(px.x, 0.0));
    vec2 bl = decodeValue(vc + vec2(0.0, px.y));
    vec2 br = decodeValue(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

float getValue(vec2 rg) {
    return length(rg);
}

float getAngle(vec2 rg) {
    float angle = atan(rg.x, rg.y);
    angle -= PI / 2.0;

    return angle;
}

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

void main () {
    vUv = uv;
    vec2 size = arrowSize * pixelsToProjUnit;
    vec2 halfSize = size / 2.0;
    vec2 worldPosition = vec2(-halfSize.x, -halfSize.y);
    if(position.x == 1.0) {
        worldPosition.x = halfSize.x;
    }

    if(position.y == 1.0) {
        worldPosition.y = halfSize.y;
    }

    // 这里需要实现 anchor
    worldPosition += halfSize * 0.5;

    vUv = vec2(uv.x, 1.0 - uv.y);

    vec2 textureCoord = (coords.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy);
    #ifdef USE_WGS84
    textureCoord = mercatorToWGS84(textureCoord);
    #endif

    vec2 rg = bilinear(textureCoord);
    float value = getValue(rg);
    float angle = getAngle(rg);

    worldPosition = rotate(worldPosition, angle);
    worldPosition += coords;

    v_speed = value;
    v_speed_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    v_linewidth = mix(0.18, 0.12, v_speed_t);
    v_head = u_head;
    v_antialias = u_antialias;
    v_body = mix(0.25, 4.0, v_speed_t);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 0.0, 1.0);
}

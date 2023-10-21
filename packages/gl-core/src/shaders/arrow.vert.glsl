#defines

attribute vec2 uv;
attribute vec2 position;
attribute vec2 coords;

uniform vec2 arrowSize;
uniform float u_head;

uniform vec2 resolution;
uniform vec2 pixelsToProjUnit;
uniform vec3 cameraPosition;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform vec2 u_extrude_scale;
uniform lowp float u_device_pixel_ratio;
uniform highp float u_camera_to_center_distance;

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

void rotate2d(inout vec2 v, float a){
    mat2 m = mat2(cos(a), -sin(a), sin(a), cos(a));
    v = m * v;
}

//vec2 calc_offset(vec2 extrusion, float radius,  float view_scale) {
//    return extrusion * radius * u_extrude_scale * view_scale;
//}

//vec4 project_vertex(vec2 extrusion, vec4 world_center, float radius,  float view_scale) {
//    vec2 sample_offset = calc_offset(extrusion, radius, view_scale);
//    return u_matrix * ( world_center + vec4(sample_offset, 0, 0) );
//}

void main () {
    vUv = uv;
    vec2 size = arrowSize * pixelsToProjUnit;
    vec2 halfSize = size / 2.0;
//    vec4 worldPosition = vec4(coords, 0.0, 1.0) * modelMatrix;
//
//    // unencode the extrusion vector that we snuck into the a_pos vector
//    vec2 extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);
//
//    // multiply a_pos by 0.5, since we had it * 2 in order to sneak
//    // in extrusion data
//    vec2 circle_center = floor(coords * 0.5);
//
//    world_center = vec4(circle_center, 0.0, 1);
//
//    vec4 projected_center = u_matrix * world_center;
//
//    view_scale = projected_center.w / u_camera_to_center_distance;
//
//    gl_Position = project_vertex(extrude, world_center, radius, view_scale);
//
//    // This is a minimum blur distance that serves as a faux-antialiasing for
//    // the circle. since blur is a ratio of the circle's size and the intent is
//    // to keep the blur at roughly 1px, the two are inversely related.
//    lowp float antialiasblur = 1.0 / u_device_pixel_ratio / radius;
//
//    v_data = vec3(extrude.x, extrude.y, antialiasblur);

    vec2 worldPosition = vec2(-halfSize.x, -halfSize.y);
    if(position.x == 1.0) {
        worldPosition.x = halfSize.x;
    }

    if(position.y == 1.0) {
        worldPosition.y = halfSize.y;
    }

    // 这里需要实现 anchor
    worldPosition += halfSize * vec2(1.0, 0);

    vUv = vec2(uv.x, 1.0 - uv.y);

    vec2 textureCoord = (coords.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy);
    #ifdef USE_WGS84
    textureCoord = mercatorToWGS84(textureCoord);
    #endif

    vec2 rg = bilinear(textureCoord);
    float value = getValue(rg);
    float angle = getAngle(rg);

    rotate2d(worldPosition, angle);
    worldPosition += coords;

    v_speed = value;
    v_speed_t = (value - colorRange.x) / (colorRange.y - colorRange.x);
    v_linewidth = mix(0.18, 0.12, v_speed_t);
    v_head = u_head;
    v_antialias = 1.0 / min(arrowSize.x, arrowSize.y);
    v_body = mix(0.25, 4.0, v_speed_t) * 3.0;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(worldPosition, 0.0, 1.0);
}

#defines

attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float u_offset;
uniform sampler2D u_image;
uniform vec2 u_image_res;
uniform vec2 u_range;
uniform vec2 u_mapping_range;

varying vec2 vUv;

#include <bilinear>;
#include <mercatorToWGS84>;
#include <transformZ>;

float calcTexture(const vec2 puv) {
    return texture2D(u_image, puv).r;
}

float getValue(const vec2 uv) {
    float min = u_mapping_range.x;
    float max = u_mapping_range.y;
    float r = bilinear(uv);
    return r * (max - min) + min;
}

void main () {
    vUv = uv;
    vec2 globalWGS84 = mercatorToWGS84(vUv);
    float value = getValue(globalWGS84);

    float z = transformZ(value, position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

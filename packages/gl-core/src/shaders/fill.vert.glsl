#defines

attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float u_offset;

varying vec2 vUv;

void main () {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy + vec2(u_offset, 0.0), position.z, 1.0);
}

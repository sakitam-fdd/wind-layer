#defines

attribute vec2 uv;
attribute vec3 position;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main () {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * resolution, 0.0, 1.0);
}

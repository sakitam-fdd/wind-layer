#defines

attribute vec2 uv;
attribute vec3 position;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main () {
    vUv = vec2(uv.x, 1.0 - uv.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

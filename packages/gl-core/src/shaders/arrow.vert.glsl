#defines

attribute vec2 uv;
attribute vec2 position;
attribute vec2 coords;

uniform vec2 arrowSize;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main () {
    vUv = uv;
    gl_PointSize = 16.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(coords, 0.0, 1.0);
}

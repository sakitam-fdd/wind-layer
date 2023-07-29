attribute vec3 position;
uniform vec3 cameraPosition;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_offset;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(u_offset, 0.0, 0.0), 1.0);
}

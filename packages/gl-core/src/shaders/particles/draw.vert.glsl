attribute vec2 reference;

attribute float a_index;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D u_particles;
//uniform sampler2D u_particles_next;

uniform float u_particleSize;
uniform float u_particlesRes;

varying vec2 v_particle_pos;

void main() {
    vec2 uv = reference;

    vec2 pos = texture2D(u_particles, uv).xy;
    v_particle_pos = pos;
    gl_PointSize = u_particleSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
}

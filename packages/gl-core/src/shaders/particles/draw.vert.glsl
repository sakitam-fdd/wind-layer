attribute vec2 reference;

attribute float a_index;

uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D u_particles;
uniform sampler2D u_particles_next;

uniform float u_particleSize;
uniform float u_particlesRes;
// 设备像素比，移动端高 DPR 屏幕需要乘以该值保证粒子尺寸正确
uniform float u_dpr;

varying vec2 v_particle_pos;

void main() {
    float v_index = floor(a_index / 6.0);
    vec2 uv = reference;
    vec4 color = texture2D(u_particles, uv);
    vec4 color1 = texture2D(u_particles_next, uv);

    v_particle_pos = mix(color.rg, color1.rg, 0.0);

    // 乘以 DPR 保证在移动端高分屏（DPR=2/3）上粒子大小与桌面端视觉一致
    gl_PointSize = u_particleSize * u_dpr;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_particle_pos, 0.0, 1.0);
}


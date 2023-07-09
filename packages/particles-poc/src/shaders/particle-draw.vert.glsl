attribute float a_index;
attribute vec2 a_reference;

uniform sampler2D u_particles;
uniform sampler2D u_particles_next;
uniform float u_particles_res;
uniform mat4 u_matrix;
uniform vec2 u_resolution;
uniform float u_aspectRatio;
uniform float u_dateline_offset;

uniform float u_offset;

varying vec2 v_particle_pos;
varying vec2 v_normal;

vec4 buildOffset(vec2 perp) {
    vec2 normal = perp * 2.1;
    normal.x /= (u_resolution.x / u_resolution.y);
    return vec4(normal, 0.0, 0.0);
}

vec4 getPosWithProject(vec2 current_pos, vec2 next_pos, float v_index) {
    vec4 currentProjected = u_matrix * vec4(current_pos, 0.0, 1.0);
    vec4 nextProjected = u_matrix * vec4(next_pos, 0.0, 1.0);

    vec2 currentScreen = currentProjected.xy / currentProjected.w * u_resolution;
    vec2 nextScreen = nextProjected.xy / nextProjected.w * u_resolution;

    vec2 dir = normalize(nextScreen - currentScreen);
    vec2 perp = vec2(-dir.y, dir.x);
    float d = length(nextScreen - currentScreen);

    vec4 pos = currentProjected;

    if (a_index - v_index * 6.0 == 0.0) {
        pos = currentProjected + buildOffset(perp);
    } else if (a_index - v_index * 6.0 == 1.0) {
        pos = currentProjected - buildOffset(perp);
    } else if (a_index - v_index * 6.0 == 2.0){
        pos = nextProjected + buildOffset(perp);
    } else if (a_index - v_index * 6.0 == 3.0) {
        pos = nextProjected + buildOffset(perp);
    } else if (a_index - v_index * 6.0 == 4.0) {
        pos = nextProjected - buildOffset(perp);
    } else if (a_index - v_index * 6.0 == 5.0) {
        pos = currentProjected - buildOffset(perp);
    }

    // 超过最大速度和小于最小速度的可以考虑移除
    if(d > 20.0 || d < 0.01) {
//        pos.xy += u_resolution * pow(2.0, 0.5 + 1.0);
    }

    return pos;
}

void main() {
    float v_index = floor(a_index / 6.0);
//    vec2 uv = a_reference;
    vec2 uv = vec2(fract(v_index / u_particles_res), floor(v_index / u_particles_res) / u_particles_res);
    vec4 color = texture2D(u_particles, uv);
    vec4 color1 = texture2D(u_particles_next, uv);

    vec2 pos = color.rg;
    vec2 pos1 = color1.rg;

    v_particle_pos = mix(pos, pos1, 0.0);

    v_normal = vec2(normalize(v_particle_pos.xy));

    gl_PointSize = 1.0;

    gl_Position = getPosWithProject(pos + vec2(u_offset, 0.0), pos1 + vec2(u_offset, 0.0), v_index);
}

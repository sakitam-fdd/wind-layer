attribute float a_index;

uniform sampler2D u_particles_current;
uniform sampler2D u_particles_next;

uniform float u_particles_res;

uniform vec2 u_world;
uniform float u_zoom;
uniform vec4 u_bbox;
uniform float u_offset;
uniform float u_width;
uniform float u_aspectRatio;
uniform mat4 u_matrix;

varying vec2 v_particle_pos;

#pragma glslify: fromRGBA = require(../decode)

vec4 buildOffset(vec2 perp) {
    vec2 normal = perp * u_width;
    normal.x /= u_aspectRatio;
    return vec4(normal, 0.0, 0.0);
}

vec4 buildOffset(vec2 perp, vec2 scale) {
    vec2 normal = perp / scale * u_width;
    normal.x /= u_aspectRatio;
    return vec4(normal, 0.0, 0.0);
}

vec4 getPosWithProject(vec2 current_pos, vec2 next_pos, float v_index) {
    vec4 currentProjected = u_matrix * vec4(current_pos, 0.0, 1.0);
    vec4 nextProjected = u_matrix * vec4(next_pos, 0.0, 1.0);

    vec2 currentScreen = currentProjected.xy / currentProjected.w * u_world;
    vec2 nextScreen = nextProjected.xy / nextProjected.w * u_world;

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
        pos.xy += u_world * pow(2.0, u_zoom + 1.0);
    }

    return pos;
}

void main() {
    float v_index = floor(a_index / 6.0);
    float ux = fract(v_index / u_particles_res);
    float vy = floor(v_index / u_particles_res) / u_particles_res;
    vec4 current_color = texture2D(u_particles_current, vec2(ux, vy));
    vec4 next_color = texture2D(u_particles_next, vec2(ux, vy));

    vec2 v_current_particle_pos = fromRGBA(current_color);
    vec2 v_next_particle_pos = fromRGBA(next_color);

    vec2 vc_pos = u_bbox.xy + v_current_particle_pos * (u_bbox.zw - u_bbox.xy);
    vec2 nc_pos = u_bbox.xy + v_next_particle_pos * (u_bbox.zw - u_bbox.xy);

    v_particle_pos = mix(vc_pos, nc_pos, 0.5);

    // 裁切掉超出视图的粒子
    v_current_particle_pos = clamp(vc_pos, 0.0, 1.0) + vec2(u_offset, 0.0);
    v_next_particle_pos = clamp(nc_pos, 0.0, 1.0) + vec2(u_offset, 0.0);

    gl_PointSize = 1.0;

    gl_Position = getPosWithProject(v_current_particle_pos, v_next_particle_pos, v_index);
}

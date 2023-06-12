attribute vec2 reference;

attribute float a_index;

uniform vec2 resolution;
uniform vec4 u_bbox;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D u_particles;
uniform sampler2D u_particles_next;

uniform float u_particleSize;
uniform float u_particlesRes;
uniform float u_offset;

varying vec2 v_particle_pos;

//vec4 buildOffset(vec2 perp) {
//    vec2 normal = perp * 2.1;
//    normal.x /= (resolution.x / resolution.y);
//    return vec4(normal, 0.0, 0.0);
//}
//
//vec4 getPosWithProject(vec2 current_pos, vec2 next_pos, float v_index) {
//    vec4 currentProjected = projectionMatrix * modelViewMatrix * vec4(current_pos, 0.0, 1.0);
//    vec4 nextProjected = projectionMatrix * modelViewMatrix * vec4(next_pos, 0.0, 1.0);
//
//    vec2 currentScreen = currentProjected.xy / currentProjected.w * resolution;
//    vec2 nextScreen = nextProjected.xy / nextProjected.w * resolution;
//
//    vec2 dir = normalize(nextScreen - currentScreen);
//    vec2 perp = vec2(-dir.y, dir.x);
//    float d = length(nextScreen - currentScreen);
//
//    vec4 pos = currentProjected;
//    float vd = a_index - v_index * 6.0;
//
//    if (vd == 0.0) {
//        pos = currentProjected + buildOffset(perp);
//    } else if (vd == 1.0) {
//        pos = currentProjected - buildOffset(perp);
//    } else if (vd == 2.0){
//        pos = nextProjected + buildOffset(perp);
//    } else if (vd == 3.0) {
//        pos = nextProjected + buildOffset(perp);
//    } else if (vd == 4.0) {
//        pos = nextProjected - buildOffset(perp);
//    } else if (vd == 5.0) {
//        pos = currentProjected - buildOffset(perp);
//    }
//
//    // 超过最大速度和小于最小速度的可以考虑移除
//    if(d > 20.0 || d < 0.01) {
////        pos.xy += resolution * pow(2.0, 0.5 + 1.0);
//    }
//
//    return pos;
//}

void main() {
    float v_index = floor(a_index / 6.0);
    vec2 uv = reference;
    vec4 color = texture2D(u_particles, uv);
    vec4 color1 = texture2D(u_particles_next, uv);

    vec2 pos = color.rg;
    vec2 pos1 = color1.rg;

    vec2 vePos = u_bbox.xy + pos * (u_bbox.zw - u_bbox.xy);
    vec2 vePos1 = u_bbox.xy + pos1 * (u_bbox.zw - u_bbox.xy);

    v_particle_pos = mix(vePos, vePos1, 0.5);

    vec2 v_current_particle_pos = vePos + vec2(u_offset, 0.0);

    gl_PointSize = u_particleSize;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_current_particle_pos * vec2(262144.0 * 2.0, 262144.0 * 2.0) + vec2(-262144.0, -262144.0), 0.0, 1.0);
}


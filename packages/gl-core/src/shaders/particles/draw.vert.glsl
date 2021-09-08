attribute float a_index;

uniform sampler2D u_particles_prev;
uniform sampler2D u_particles_next;

uniform float u_particles_res;
uniform vec2 u_width;

varying vec2 v_tex_pos;

#pragma glslify: fromRGBA = require(../decode)

void main() {
    float v_index = floor(a_index / 6.0);
    float ux = fract(v_index / u_particles_res);
    float vy = floor(v_index / u_particles_res) / u_particles_res;
    vec4 color_prev = texture2D(u_particles_prev, vec2(ux, vy));
    vec4 color_next = texture2D(u_particles_next, vec2(ux, vy));

    vec2 v_particle_prev_pos = fromRGBA(color_prev);

    v_particle_prev_pos = vec2(v_particle_prev_pos.x * 2.0 - 1.0, v_particle_prev_pos.y * 2.0 - 1.0);

    vec2 v_particle_next_pos = fromRGBA(color_next);
    v_particle_next_pos = vec2(v_particle_next_pos.x * 2.0 - 1.0, v_particle_next_pos.y * 2.0 - 1.0);

    gl_PointSize = 1.0;

    vec2 dirF = v_particle_prev_pos - v_particle_next_pos;
    vec2 dirFN = normalize(dirF);// normalized forward direction ( from B to A )
    float d = length(dirF);// d can be used for alpha from speed
    vec2 dirRN = vec2(dirFN.y, -dirFN.x);// perpendicular direction (right from dirFN)

    vec2 pos = vec2(v_particle_prev_pos);

    if (a_index - v_index * 6.0 == 0.0) {
        pos = v_particle_prev_pos + dirRN * u_width;
    } else if (a_index - v_index * 6.0 == 1.0) {
        pos = v_particle_prev_pos - dirRN * u_width;
    } else if (a_index-v_index*6.0==2.0){
        pos = v_particle_next_pos + dirRN * u_width;
    } else if (a_index - v_index * 6.0 == 3.0) {
        pos = v_particle_next_pos + dirRN * u_width;
    } else if (a_index - v_index * 6.0 == 4.0) {
        pos = v_particle_next_pos - dirRN * u_width;
    } else if (a_index - v_index * 6.0 == 5.0) {
        pos = v_particle_prev_pos - dirRN * u_width;
    }

    if(d > 0.02 || d < 0.00005) {
      pos.x += 10.0;
    }

    gl_Position = vec4(pos, 0.0, 1.0);
}

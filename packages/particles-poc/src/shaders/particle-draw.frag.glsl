precision mediump float;

uniform sampler2D u_wind;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;

varying vec2 v_particle_pos;
varying vec2 v_normal;

void main() {
    vec4 color = vec4(1.0, 1.0, 1.0, 0.9);
    vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);
    float speed_t = length(velocity) / length(u_wind_max);

    float blur = 1.0;
//    blur = 1.0 - smoothstep(0.8, 1.0, length(v_particle_pos));
    color.a *= blur;

    gl_FragColor = color;
}

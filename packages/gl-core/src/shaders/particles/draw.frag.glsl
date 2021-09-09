precision highp float;

uniform sampler2D u_wind;
uniform vec4 u_wind_range;
uniform vec2 u_color_range;
uniform sampler2D u_color_ramp;

varying vec2 v_particle_pos;

void main() {
    vec2 velocity = mix(vec2(u_wind_range.xz), vec2(u_wind_range.yw), texture2D(u_wind, v_particle_pos).rg);
    float speed_t = length(velocity);

    float value_t = (speed_t - u_color_range.x) / (u_color_range.y - u_color_range.x);
    // color ramp is./ encoded in a 16x16 texture
    vec2 ramp_pos = vec2(fract(16.0 * value_t), floor(16.0 * value_t) / 16.0);

    vec4 color = texture2D(u_color_ramp, ramp_pos);
    gl_FragColor = vec4(floor(255.0 * color * color.a) / 255.0);
}

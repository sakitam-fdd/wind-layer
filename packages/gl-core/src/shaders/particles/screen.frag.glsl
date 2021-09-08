precision highp float;

uniform sampler2D u_screen;
uniform float u_opacity;
uniform float u_fade;

varying vec2 v_tex_pos;

void main() {
    vec4 color = texture2D(u_screen, v_tex_pos);
    gl_FragColor = vec4(floor(255.0 * color * u_opacity * u_fade) / 255.0);
}

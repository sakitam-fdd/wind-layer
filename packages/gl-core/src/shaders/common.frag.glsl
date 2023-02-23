precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;
uniform float u_fade_t;
uniform float opacity;

varying vec2 vUv;

void main () {
    vec2 uv = vUv;

    vec4 color0 = texture2D(u_texture, vUv);
    vec4 color1 = texture2D(u_textureNext, vUv);

    vec4 color = mix(color0, color1, u_fade_t);

    gl_FragColor = vec4(floor(255.0 * color * opacity) / 255.0);
}

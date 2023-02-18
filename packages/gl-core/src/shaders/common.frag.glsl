precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_textureNext;

uniform float opacity;

varying vec2 vUv;

void main () {
    vec2 uv = vUv;

    vec4 color = texture2D(u_texture, vUv);

    gl_FragColor = vec4(floor(255.0 * color * opacity) / 255.0);
}

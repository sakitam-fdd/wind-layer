precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image;
void main() {
    vec4 color = texture2D(u_image, vUv);
    gl_FragColor = color;
}

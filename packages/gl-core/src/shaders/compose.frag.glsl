precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image0;


void main() {
    vec4 color = texture2D(u_image0, vUv);
    gl_FragColor = color;
}

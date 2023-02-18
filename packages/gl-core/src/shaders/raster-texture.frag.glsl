precision highp float;

varying vec2 vUv;
uniform sampler2D u_image0;

vec4 getColor(const vec2 uv) {
    return texture2D(u_image0, uv).rgba;
}

void main() {
    gl_FragColor = getColor(vUv);
}

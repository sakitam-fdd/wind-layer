precision highp float;

uniform sampler2D u_wind;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;

varying vec2 v_particle_pos;
varying vec2 v_normal;
uniform vec4 u_bbox;
uniform vec4 u_data_bbox;

float wrapx(float x) {
    return mod(x + 1.0, 1.0);
}

float wrapx(float x, float min) {
    float wrappedX = wrapx(x);
    if (wrappedX < min) {
        wrappedX += 1.0;
    }
    return wrappedX;
}

bool containsXY(vec2 pos, vec4 bbox) {
    float x = wrapx(pos.x, bbox.x);
    return (
    bbox.x < x && x < bbox.z &&
    bbox.y < pos.y && pos.y < bbox.w
    );
}

vec4 calcTexture(const vec2 puv) {
    return texture2D(u_wind, puv);
}

void main() {
    vec4 color = vec4(1.0, 1.0, 1.0, 0.9);

    vec4 pv = calcTexture(v_particle_pos);

    if (!containsXY(v_particle_pos.xy, u_data_bbox) || !containsXY(v_particle_pos.xy, u_bbox) || pv.a == 0.0) {
        discard;
    }

    vec2 velocity = mix(u_wind_min, u_wind_max, pv.rg);
    float speed_t = length(velocity) / length(u_wind_max);

//    float blur = 1.0;
//    blur = 1.0 - smoothstep(0.8, 1.0, length(v_particle_pos));
//    color.a *= blur;

    float distance = length(2.0 * gl_PointCoord - 1.0);
    if (distance > 1.0) {
//        discard;
    }

    gl_FragColor = color;
}

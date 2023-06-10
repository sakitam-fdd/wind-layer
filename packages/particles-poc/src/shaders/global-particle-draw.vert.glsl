attribute float a_index;

uniform sampler2D u_particles;
uniform sampler2D u_particles_next;
uniform float u_particles_res;
uniform mat4 u_matrix;
uniform vec2 u_resolution;
uniform float u_aspectRatio;
uniform float u_dateline_offset;

uniform mat4 u_globeToMercMatrix;
uniform float u_globeToMercatorTransition;
uniform vec2 u_centerInMerc;
uniform float u_pixelsPerMeterRatio;

uniform vec4 u_bbox;
uniform vec4 u_data_bbox;

varying vec2 v_particle_pos;
varying vec2 v_normal;

const float PI = 3.14159265359;
const float EXTENT = 8192.0;

const float GLOBE_RADIUS = EXTENT / PI / 2.0;
const float earthRadius = 6371008.8;

vec4 buildOffset(vec2 perp) {
    vec2 normal = perp * 2.1;
    normal.x /= (u_resolution.x / u_resolution.y);
    return vec4(normal, 0.0, 0.0);
}

float globeMetersToEcef(float d) {
    return d * GLOBE_RADIUS / earthRadius;
}

float latFromMercatorY(float y) {
    float y2 = 180.0 - y * 360.0;
    return 360.0 / PI * atan(exp(radians(y2))) - 90.0;
}

float lngFromMercatorX(float x) {
    return x * 360.0 - 180.0;
}

vec3 csLatLngToECEF(float cosLat, float sinLat, float lng, float radius) {
    lng = radians(lng);

    float sx = cosLat * sin(lng) * radius;
    float sy = -sinLat * radius;
    float sz = cosLat * cos(lng) * radius;

    return vec3(sx, sy, sz);
}

vec3 latLngToECEF(float lat, float lng, float radius) {
    return csLatLngToECEF(cos(radians(lat)), sin(radians(lat)), lng, radius);
}

vec3 toEcef(float x, float y, float altitude) {
    float altInEcef = globeMetersToEcef(altitude);
    float radius = GLOBE_RADIUS + altInEcef;
    float lat = latFromMercatorY(y);
    float lng = lngFromMercatorX(x);
    return latLngToECEF(lat, lng, radius);
}

void main() {
    float v_index = floor(a_index / 1.0);
    vec2 uv = vec2(fract(v_index / u_particles_res), floor(v_index / u_particles_res) / u_particles_res);
    vec4 color = texture2D(u_particles, uv);
    vec4 color1 = texture2D(u_particles_next, uv);

    vec2 pos = color.rg;
    vec2 pos1 = color1.rg;

    vec2 vePos = u_bbox.xy + pos * (u_bbox.zw - u_bbox.xy);
    vec2 vePos1 = u_bbox.xy + pos1 * (u_bbox.zw - u_bbox.xy);

    // decode current particle position from the pixel's RGBA value
    v_particle_pos = pos;

    v_normal = vec2(normalize(pos.xy));

    gl_PointSize = 1.0;

    vec3 a_pos_ecef = toEcef(vePos.x, vePos.y, 0.0);

    vec4 p = u_matrix * u_globeToMercMatrix * vec4(a_pos_ecef, 1.);
    p /= p.w;
    if (u_globeToMercatorTransition > 0.) {

        vec4 merc = vec4(vePos, 0.0, 1.);
        merc.xy = (merc.xy - u_centerInMerc) * u_pixelsPerMeterRatio + u_centerInMerc;
        merc.z *= u_pixelsPerMeterRatio;

        merc = u_matrix * merc;
        merc /= merc.w;
        p = mix(p, merc, u_globeToMercatorTransition);
    }

    gl_Position = p;
}

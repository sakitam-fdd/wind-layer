in vec3 sourcePosition;
out vec3 targetPosition;

uniform sampler2D u_wind;
uniform sampler2D u_particles;

uniform vec2 u_wind_res;
uniform vec4 u_bbox; // -132.9653, 47.3336, -111.8715, 51.3052 || [179.88395702481898, 36.260284588455164, 261.3988416483198, 46.30869660622756]
uniform float viewportZoomChangeFactor;

uniform sampler2D bitmapTexture;
uniform vec2 imageUnscale;
uniform vec4 u_data_bbox; // -125.0900, 48.2328, -119.7468, 50.4861

uniform float numParticles;
uniform float maxAge;
uniform float speedFactor;

uniform float time;
uniform float seed;

const vec2 drop_pos = vec2(0.0);

bool isNaN(float value) {
    return !(value <= 0. || 0. <= value);
}

// longitude wrapping allows rendering in a repeated MapView
float wrapLongitude(float lng) {
    // mod(xmin + 180, 360) - 180
    float wrappedLng = mod(lng + 180., 360.) - 180.;
    return wrappedLng;
}

float wrapLongitude(float lng, float minLng) {
    float wrappedLng = wrapLongitude(lng);
    if (wrappedLng < minLng) {
        wrappedLng += 360.;
    }
    return wrappedLng;
}

vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);

float rand(vec2 seed) {
    float t = dot(rand_constants.xy, seed.xy);
    return fract(sin(t) * (rand_constants.z + t));
}

vec2 randPoint(vec2 seed) {
    return vec2(rand(seed + 1.3), rand(seed + 2.1));
}

// 这里是得到一个 point：x 0-1 y 0-1
// 然后去当前视野随机出一个经纬度位置
vec2 pointToPosition(vec2 point) {
    vec2 viewportBoundsMin = u_bbox.xy;
    vec2 viewportBoundsMax = u_bbox.zw;
    return mix(viewportBoundsMin, viewportBoundsMax, point);
}

bool isPositionInBounds(vec2 position, vec4 u_data_bbox) {
    vec2 boundsMin = u_data_bbox.xy;
    vec2 boundsMax = u_data_bbox.zw;
    float lng = wrapLongitude(position.x, boundsMin.x);
    float lat = position.y;
    return (
    boundsMin.x <= lng && lng <= boundsMax.x &&
    boundsMin.y <= lat && lat <= boundsMax.y
    );
}

bool isPositionInViewport(vec2 position) {
    return isPositionInBounds(position, u_bbox);
}

// bitmapTexture is in COORDINATE_SYSTEM.LNGLAT
// no coordinate conversion needed
vec2 getUV(vec2 pos) {
    return vec2(
    (pos.x - u_data_bbox[0]) / (u_data_bbox[2] - u_data_bbox[0]),
    (pos.y - u_data_bbox[3]) / (u_data_bbox[1] - u_data_bbox[3])
    );
}

vec2 raster_get_values(vec4 color) {
    return mix(vec2(imageUnscale[0]), vec2(imageUnscale[1]), color.xy);
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_wind(const vec2 uv) {
    // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(uv * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = texture2D(u_wind, vc).rg;
    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;
    vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;
    vec2 br = texture2D(u_wind, vc + px).rg;
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {

    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 sourcePos = color.rg; // decode particle position from pixel RGBA
    vec2 pos = drop_pos;

    float particleIndex = mod(float(gl_VertexID), numParticles);
    float particleAge = floor(float(gl_VertexID) / numParticles);

    // update particles age0
    // older particles age1-age(N-1) are copied with buffer.copyData
    if (particleAge > 0.) {
        return;
    }

    // 如果原来的位置为 0:0，那么重新随机
    if (sourcePos.xy == drop_pos) {
        // generate random position to prevent converging particles
        vec2 particleSeed = vec2(particleIndex * seed / numParticles);
        vec2 point = randPoint(particleSeed);
        vec2 position = pointToPosition(point);
        targetPosition.xy = position;
        // 将 y 方向数据处理
        targetPosition.x = wrapLongitude(targetPosition.x);
        return;
    }

    // 如果原来位置不在数据范围内，抛弃掉
    if (!isPositionInBounds(sourcePos.xy, u_data_bbox)) {
        // drop out of u_data_bbox
        pos.xy = drop_pos;
        return;
    }

    // 如果原来位置不在视野范围内，抛弃掉
    if (!isPositionInViewport(sourcePosition.xy)) {
        // drop out of viewport
        targetPosition.xy = drop_pos;
        return;
    }

    if (viewportZoomChangeFactor > 1. && mod(particleIndex, viewportZoomChangeFactor) >= 1.) {
        // drop when zooming out
        targetPosition.xy = drop_pos;
        return;
    }

    if (abs(mod(particleIndex, maxAge + 2.) - mod(time, maxAge + 2.)) < 1.) {
        // drop by maxAge, +2 because only non-randomized pairs are rendered
        targetPosition.xy = drop_pos;
        return;
    }

    // 根据源位置计算 UV
    vec2 uv = getUV(sourcePosition.xy);
    // 从纹理取出数据
    vec4 data = texture2D(u_wind, uv);

    // 无数据
    if (data.a == 0.0) {
        // drop nodata
        targetPosition.xy = drop_pos;
        discard;
    }

    // update position
    vec2 speed = lookup_wind(uv) * speedFactor;
    float distortion = cos(radians(color.y));
    vec2 offset = vec2(speed.x / distortion, speed.y);
    vec2 pos = color.xy + offset;
    pos.x = wrapLongitude(pos.x);
    // 得到经纬度坐标
    gl_FragColor = vec4(pos.xy, 0.0, 1.0);
}

#defines

attribute vec2 uv;
attribute vec3 position;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 u_tile_bbox; // 瓦片范围
uniform vec4 u_data_bbox; // 瓦片范围

varying vec2 vUv;

void main () {
    vec2 pos = u_tile_bbox.xy + position.xy * (u_tile_bbox.zw - u_tile_bbox.xy);

    vec2 textureCoord = (pos.xy - u_data_bbox.xy) / (u_data_bbox.zw - u_data_bbox.xy);

    vUv = vec2(textureCoord.x, 1.0 - textureCoord.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
}

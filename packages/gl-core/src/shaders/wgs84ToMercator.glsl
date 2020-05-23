const float PI = 3.14159265359;

vec2 wgs84ToMercator(vec2 xy) {
  // convert to angle
  float y = -180.0 * xy.y + 90.0;
  // use the formule to convert
  y = (180.0 - (180.0 / PI * log(tan(PI / 4.0 + y * PI / 360.0)))) / 360.0;
  // pass x through, as it doesn't change
  return vec2(xy.x, y);
}

#pragma glslify: export(wgs84ToMercator)

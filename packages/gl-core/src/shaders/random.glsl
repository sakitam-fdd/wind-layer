// pseudo-random generator
//const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
//float rand(const vec2 co) {
//  float t = dot(rand_constants.xy, co);
//  return fract(sin(t) * (rand_constants.z + t));
//}

highp float rand(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy ,vec2(a, b));
  highp float sn = mod(dt, 3.14);
  return fract(sin(sn) * c);
}

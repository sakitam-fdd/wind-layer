// pseudo-random generator
// https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl

//const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
//float rand(const vec2 co) {
//  float t = dot(rand_constants.xy, co);
//  return fract(sin(t) * (rand_constants.z + t));
//}

highp float rand(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
    // dot可以根据不同的值位置，返回一个 0.0 到 1.0 之间的值
  highp float dt = dot(co.xy ,vec2(a, b));
  highp float sn = mod(dt, 3.14);
  // 因为sin函数的值域 [-1, 1]; 所以我们这步操作是将一个随机的浮点数d，转换到[-1, 1]这个区间
  // 这个fract是获取d的小数部分，目的是将[-43758.5453, 43758.5453]之间的值域，重新压入到[0, 1]之间
  return fract(sin(sn) * c);
}

precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);

  for (int i = 0; i < 7; i++) {
    value += valueNoise(p) * amp;
    p = rot * p * 2.02 + 17.31;
    amp *= 0.5;
  }

  return value;
}

float ridgedFbm(vec2 p) {
  float value = 0.0;
  float amp = 0.55;
  mat2 rot = mat2(0.76, -0.65, 0.65, 0.76);

  for (int i = 0; i < 6; i++) {
    float n = valueNoise(p);
    n = 1.0 - abs(n * 2.0 - 1.0);
    value += n * amp;
    p = rot * p * 2.18 + 9.4;
    amp *= 0.48;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 wind = vec2(u_time * 0.035, -u_time * 0.018);
  vec2 mouse = (u_mouse - 0.5) * 0.7;
  float warpA = fbm(p * 1.4 + wind);
  float warpB = fbm(p * 2.1 - wind + 4.8);
  vec2 warped = p + vec2(warpA - 0.5, warpB - 0.5) * (0.38 + u_intensity * 0.20);
  warped += mouse * 0.08;

  float mountains = ridgedFbm(warped * 3.0 + vec2(0.0, 1.2));
  float erosion = fbm(warped * 8.0 + mountains * 1.4);
  float clouds = fbm(vec2(p.x * 1.2, p.y * 2.4) + wind * 0.8 + warpA);

  float horizon = 0.36 + mountains * 0.22 - erosion * 0.08;
  float terrainMask = smoothstep(horizon + 0.02, horizon - 0.02, uv.y);
  float snow = smoothstep(0.68, 0.92, mountains + uv.y * 0.34);
  float slope = smoothstep(0.12, 0.72, erosion);

  vec3 skyLow = vec3(0.18, 0.25, 0.30);
  vec3 skyHigh = vec3(0.70, 0.74, 0.68);
  vec3 color = mix(skyLow, skyHigh, smoothstep(0.0, 1.0, uv.y));
  color += clouds * vec3(0.25, 0.23, 0.19) * smoothstep(0.38, 0.92, uv.y) * 0.32;

  vec3 rock = mix(vec3(0.16, 0.14, 0.12), vec3(0.46, 0.39, 0.29), slope);
  vec3 moss = vec3(0.17, 0.25, 0.16);
  vec3 ice = vec3(0.82, 0.82, 0.74);
  vec3 terrain = mix(rock, moss, smoothstep(0.30, 0.62, erosion) * 0.42);
  terrain = mix(terrain, ice, snow * 0.62);
  terrain -= ridgedFbm(warped * 15.0) * vec3(0.07, 0.06, 0.05);

  color = mix(color, terrain, terrainMask);

  float fog = smoothstep(0.62, 0.10, abs(uv.y - horizon)) * (1.0 - terrainMask * 0.4);
  color = mix(color, vec3(0.74, 0.70, 0.60), fog * 0.18);

  float sun = exp(-length(p - vec2(0.36, 0.24)) * 4.5);
  color += sun * vec3(0.80, 0.62, 0.32) * (0.16 + u_intensity * 0.22);

  float vignette = smoothstep(0.96, 0.22, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}

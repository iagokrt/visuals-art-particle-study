precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(113.5, 271.9))) * 48271.29);
}

float noise(vec2 p) {
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
  for (int i = 0; i < 5; i++) {
    value += noise(p) * amp;
    p *= 2.02;
    amp *= 0.52;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float horizon = 0.52 + sin(u_time * 0.18) * 0.01;
  float isWater = smoothstep(horizon + 0.02, horizon - 0.02, uv.y);
  float ripple = sin((uv.x * 28.0) + u_time * 0.9) * 0.004;
  ripple += sin((uv.x * 9.0) - u_time * 0.35) * 0.009;

  vec2 reflected = vec2(uv.x + ripple, 1.0 - uv.y + ripple * 3.0);
  float mountain = smoothstep(0.33, 0.30, reflected.y + fbm(vec2(reflected.x * 2.2, 0.4)) * 0.22);
  float farMountain = smoothstep(0.47, 0.43, reflected.y + fbm(vec2(reflected.x * 3.6 + 8.0, 1.1)) * 0.10);

  vec3 skyLow = vec3(0.18, 0.21, 0.24);
  vec3 skyHigh = vec3(0.62, 0.60, 0.52);
  vec3 color = mix(skyLow, skyHigh, smoothstep(0.1, 1.0, uv.y));
  color = mix(color, vec3(0.10, 0.12, 0.13), farMountain * 0.75);
  color = mix(color, vec3(0.045, 0.052, 0.050), mountain);

  vec3 water = mix(vec3(0.035, 0.052, 0.062), vec3(0.26, 0.27, 0.24), smoothstep(0.0, 0.58, uv.y));
  float reflection = smoothstep(0.34, 0.03, abs(uv.x - 0.5 + ripple * 4.0)) * smoothstep(0.47, 0.08, uv.y);
  water += reflection * vec3(0.38, 0.34, 0.24) * (0.25 + u_intensity * 0.25);
  water += fbm(vec2(uv.x * 18.0, uv.y * 20.0 - u_time * 0.22)) * 0.035;

  color = mix(color, water, isWater);

  float figure = smoothstep(0.018, 0.0, length((uv - vec2(0.5 + (u_mouse.x - 0.5) * 0.08, horizon + 0.015)) * vec2(1.0, 1.8)) - 0.015);
  color = mix(color, vec3(0.012, 0.012, 0.013), figure);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.035;
  float vignette = smoothstep(0.92, 0.22, length(p));
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

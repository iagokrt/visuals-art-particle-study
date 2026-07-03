precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += noise(p) * a;
    p = mat2(1.62, -1.18, 1.18, 1.62) * p;
    a *= 0.52;
  }
  return v;
}

float ribbon(vec2 uv, float seed, float width, float phase) {
  float x = uv.x;
  float drift = fbm(vec2(x * 2.2 + seed, u_time * 0.06 + seed)) - 0.5;
  float waveA = sin(x * (5.0 + seed * 0.4) + phase + u_time * 0.33);
  float waveB = sin(x * (11.0 + seed * 0.9) - phase * 1.7 - u_time * 0.21);
  float center = 0.48 + drift * 0.24 + waveA * 0.14 + waveB * 0.045;
  float fold = sin((uv.y - center) * 42.0 + x * 9.0 + phase) * 0.5 + 0.5;
  float d = abs(uv.y - center);
  float body = smoothstep(width, 0.0, d);
  float edge = smoothstep(width * 0.72, width * 0.18, d) - smoothstep(width * 0.18, 0.0, d);
  return body * (0.20 + fold * 0.42) + edge * 0.65;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 paper = vec3(0.965, 0.972, 0.978);
  vec3 color = paper;

  vec2 warped = uv;
  float pull = (u_mouse.x - 0.5) * 0.08;
  warped.y += sin(uv.x * 4.0 + u_time * 0.12) * 0.035 + pull;

  float r1 = ribbon(warped, 0.2, 0.115, 0.4);
  float r2 = ribbon(warped + vec2(0.04, -0.10), 2.7, 0.090, 2.3);
  float r3 = ribbon(warped + vec2(-0.06, 0.12), 5.1, 0.078, 4.8);
  float r4 = ribbon(warped + vec2(0.12, 0.02), 8.4, 0.060, 1.6);

  vec3 cyan = vec3(0.02, 0.58, 0.76);
  vec3 blue = vec3(0.02, 0.12, 0.62);
  vec3 violet = vec3(0.43, 0.06, 0.72);
  vec3 magenta = vec3(0.73, 0.02, 0.54);

  color = mix(color, cyan, r1 * 0.46 * u_intensity);
  color = mix(color, blue, r2 * 0.40 * u_intensity);
  color = mix(color, violet, r3 * 0.44 * u_intensity);
  color = mix(color, magenta, r4 * 0.42 * u_intensity);

  float ink = max(max(r1, r2), max(r3, r4));
  float vein = fbm(vec2(uv.x * 18.0 + u_time * 0.05, uv.y * 9.0));
  float fineLine = smoothstep(0.76, 0.92, vein) * ink;
  color = mix(color, vec3(0.05, 0.08, 0.28), fineLine * 0.18);

  float glow = smoothstep(0.0, 0.75, ink) * 0.10;
  color -= glow * vec3(0.02, 0.015, 0.0);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.018;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}

precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.3, 289.7))) * 13257.11);
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

float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float sky = smoothstep(0.0, 1.0, uv.y);
  vec3 color = mix(vec3(0.025, 0.030, 0.044), vec3(0.12, 0.15, 0.19), sky);

  float cloud = noise(vec2(uv.x * 2.2 + u_time * 0.035, uv.y * 4.0));
  color -= cloud * vec3(0.035, 0.045, 0.055);

  float ground = smoothstep(0.32, 0.28, uv.y + sin(uv.x * 9.0) * 0.015);
  color = mix(color, vec3(0.012, 0.014, 0.017), ground);

  vec2 hero = p - vec2(-0.28 + (u_mouse.x - 0.5) * 0.08, -0.15);
  float body = capsule(hero, vec2(0.0, -0.16), vec2(0.0, 0.12), 0.035);
  float head = length(hero - vec2(0.0, 0.18)) - 0.035;
  float cloak = capsule(hero, vec2(-0.045, 0.09), vec2(-0.13, -0.18), 0.025);
  float sword = capsule(hero, vec2(0.04, -0.03), vec2(0.18, -0.24), 0.006);
  float silhouette = smoothstep(0.012, 0.0, min(min(body, head), min(cloak, sword)));
  color = mix(color, vec3(0.002, 0.003, 0.004), silhouette);

  float rainMask = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 rainUv = uv * vec2(36.0 + fi * 9.0, 12.0) + vec2(fi * 2.1, u_time * (5.5 + fi));
    float streak = smoothstep(0.045, 0.0, abs(fract(rainUv.x + rainUv.y * 0.25) - 0.5));
    rainMask += streak * smoothstep(0.98, 0.74, fract(rainUv.y));
  }

  float lightning = pow(max(0.0, sin(u_time * 0.78 + 1.6)), 46.0);
  lightning += pow(max(0.0, sin(u_time * 0.51 + 4.2)), 64.0);
  color += rainMask * vec3(0.10, 0.13, 0.16) * (0.12 + u_intensity * 0.16);
  color += lightning * vec3(0.55, 0.66, 0.86) * (0.32 + u_intensity * 0.45);

  float vignette = smoothstep(0.9, 0.25, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}

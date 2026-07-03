precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

  float body = smoothstep(0.62, 0.22, length(centered * vec2(0.75, 1.22)));
  float rib = sin((uv.x * 18.0) + noise(uv * 6.0) * 2.0) * 0.5 + 0.5;
  float hair = smoothstep(0.72, 0.98, rib) * body;
  float wind = sin(uv.y * 22.0 + u_time * 1.3 + noise(uv * 4.0) * 4.0);
  float edge = smoothstep(0.03, 0.35, body) - smoothstep(0.58, 0.84, body);
  float eye = exp(-distance(uv, vec2(0.63, 0.55)) * 24.0);
  float mouseGlow = exp(-distance(uv, u_mouse) * 8.0);

  vec3 stone = vec3(0.19, 0.18, 0.15);
  vec3 moss = vec3(0.25, 0.30, 0.20);
  vec3 fur = vec3(0.64, 0.58, 0.45);
  vec3 light = vec3(0.98, 0.80, 0.48);

  vec3 color = mix(stone, moss, noise(uv * 3.0));
  color = mix(color, fur, hair * (0.45 + wind * 0.12 * u_intensity));
  color += edge * vec3(0.18, 0.15, 0.10);
  color += eye * light * (0.4 + u_intensity * 0.5);
  color += mouseGlow * vec3(0.04, 0.08, 0.07);
  color *= 0.82 + body * 0.42;

  gl_FragColor = vec4(color, 1.0);
}

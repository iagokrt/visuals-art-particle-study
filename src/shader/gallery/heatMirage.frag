precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(87.1, 191.7))) * 90131.17);
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
    p *= 2.0;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float heat = fbm(vec2(uv.x * 3.0 + u_time * 0.08, uv.y * 18.0 - u_time * 0.55));
  float shimmer = (heat - 0.5) * 0.04 * smoothstep(0.15, 0.72, uv.y) * u_intensity;
  uv.x += shimmer;

  float horizon = 0.48 + sin(uv.x * 5.0 + u_time * 0.2) * 0.012;
  float sky = smoothstep(0.1, 1.0, uv.y);
  vec3 color = mix(vec3(0.54, 0.35, 0.20), vec3(0.93, 0.72, 0.43), sky);

  float dune1 = smoothstep(horizon + 0.12, horizon - 0.02, uv.y + sin(uv.x * 4.0) * 0.06);
  float dune2 = smoothstep(0.30, 0.18, uv.y + sin(uv.x * 6.5 + 1.4) * 0.035);
  color = mix(color, vec3(0.48, 0.31, 0.18), dune1 * 0.55);
  color = mix(color, vec3(0.25, 0.16, 0.11), dune2);

  vec2 sunPos = vec2(0.66 + (u_mouse.x - 0.5) * 0.08, 0.64);
  float sun = smoothstep(0.22, 0.0, length(uv - sunPos));
  float glare = smoothstep(0.78, 0.0, abs(uv.y - sunPos.y)) * smoothstep(0.55, 0.02, abs(uv.x - sunPos.x));
  color += sun * vec3(1.0, 0.70, 0.30) * (0.38 + u_intensity * 0.35);
  color += glare * vec3(0.55, 0.26, 0.10) * 0.12;

  float road = smoothstep(0.01, 0.23, abs(p.x) - (0.11 + (0.52 - uv.y) * 0.5)) * smoothstep(0.58, 0.2, uv.y);
  color = mix(color, vec3(0.13, 0.10, 0.09), road * 0.35);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.04;
  float vignette = smoothstep(0.94, 0.2, length(p));
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

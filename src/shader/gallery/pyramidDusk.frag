precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float pyramid(vec2 uv, vec2 center, float width, float height) {
  vec2 q = uv - center;
  float edge = height * (1.0 - abs(q.x) / width);
  return smoothstep(0.0, 0.01, edge - q.y) * smoothstep(-0.01, 0.01, q.y);
}

float pyramidEdge(vec2 uv, vec2 center, float width, float height) {
  vec2 q = uv - center;
  float left = abs(q.y - height * (1.0 + q.x / width));
  float right = abs(q.y - height * (1.0 - q.x / width));
  return smoothstep(0.012, 0.0, min(left, right));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 skyTop = vec3(0.12, 0.10, 0.18);
  vec3 skyLow = vec3(0.95, 0.55, 0.25);
  vec3 color = mix(skyLow, skyTop, smoothstep(0.20, 1.0, uv.y));

  vec2 sunPos = vec2(0.63 + (u_mouse.x - 0.5) * 0.08, 0.50);
  float sun = smoothstep(0.16, 0.0, length(uv - sunPos));
  color += sun * vec3(1.0, 0.54, 0.16) * (0.36 + u_intensity * 0.24);

  float duneBack = smoothstep(0.48, 0.34, uv.y + sin(uv.x * 5.0 + u_time * 0.08) * 0.035);
  float duneFront = smoothstep(0.31, 0.16, uv.y + sin(uv.x * 7.5 + 1.4) * 0.025);
  color = mix(color, vec3(0.48, 0.31, 0.18), duneBack * 0.65);
  color = mix(color, vec3(0.28, 0.18, 0.12), duneFront);

  float p1 = pyramid(uv, vec2(0.28, 0.33), 0.20, 0.28);
  float p2 = pyramid(uv, vec2(0.52, 0.31), 0.26, 0.36);
  float p3 = pyramid(uv, vec2(0.75, 0.34), 0.16, 0.23);
  float monuments = max(max(p1, p2), p3);
  vec3 stoneLit = vec3(0.62, 0.42, 0.24);
  vec3 stoneDark = vec3(0.19, 0.12, 0.10);
  float sideLight = smoothstep(0.0, 1.0, uv.x + uv.y * 0.4);
  color = mix(color, mix(stoneDark, stoneLit, sideLight), monuments);

  float edges = pyramidEdge(uv, vec2(0.28, 0.33), 0.20, 0.28);
  edges += pyramidEdge(uv, vec2(0.52, 0.31), 0.26, 0.36);
  edges += pyramidEdge(uv, vec2(0.75, 0.34), 0.16, 0.23);
  color += edges * vec3(0.26, 0.18, 0.10);

  float dust = noise(vec2(uv.x * 5.0 + u_time * 0.12, uv.y * 16.0 - u_time * 0.06));
  color = mix(color, vec3(0.82, 0.62, 0.40), dust * smoothstep(0.12, 0.62, uv.y) * 0.18);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.035;
  float vignette = smoothstep(0.98, 0.22, length(p));
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

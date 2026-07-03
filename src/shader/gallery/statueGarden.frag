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
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float statue(vec2 p) {
  float head = length(p - vec2(0.02, 0.28)) - 0.075;
  float neck = capsule(p, vec2(0.01, 0.20), vec2(0.0, 0.11), 0.035);
  float torso = capsule(p, vec2(-0.02, 0.12), vec2(-0.05, -0.28), 0.115);
  float shoulder = capsule(p, vec2(-0.23, 0.08), vec2(0.19, 0.07), 0.065);
  float arm = capsule(p, vec2(0.15, 0.04), vec2(0.24, -0.24), 0.045);
  return min(min(head, neck), min(min(torso, shoulder), arm));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = mix(vec3(0.06, 0.10, 0.08), vec3(0.42, 0.48, 0.36), uv.y);
  float foliage = noise(uv * 7.0 + vec2(0.0, u_time * 0.04));
  foliage += noise(uv * 17.0) * 0.45;
  color = mix(color, vec3(0.09, 0.20, 0.11), smoothstep(0.35, 0.86, foliage) * 0.55);

  float pedestal = smoothstep(0.22, 0.20, uv.y) * smoothstep(0.20, 0.31, uv.x) * smoothstep(0.80, 0.69, uv.x);
  color = mix(color, vec3(0.25, 0.24, 0.20), pedestal);

  vec2 sp = p;
  sp.x += sin(uv.y * 5.0) * 0.018;
  float d = statue(sp);
  float body = smoothstep(0.012, 0.0, d);
  float edge = smoothstep(0.030, 0.0, abs(d));
  vec3 stone = mix(vec3(0.30, 0.30, 0.27), vec3(0.72, 0.70, 0.62), smoothstep(-0.12, 0.34, p.x + p.y));
  color = mix(color, stone, body);
  color = mix(color, vec3(0.08, 0.07, 0.055), edge * 0.22);

  float moss = noise(sp * 16.0 + vec2(1.0, 4.0));
  moss *= smoothstep(0.05, -0.18, d) * smoothstep(0.50, -0.10, sp.y);
  color = mix(color, vec3(0.12, 0.24, 0.10), moss * (0.30 + u_intensity * 0.22));

  float leafLight = smoothstep(0.15, 0.0, length(uv - vec2(0.35 + (u_mouse.x - 0.5) * 0.12, 0.72)));
  color += leafLight * vec3(0.52, 0.48, 0.28) * 0.22;

  float dust = hash(gl_FragCoord.xy + u_time) * 0.035;
  float vignette = smoothstep(0.92, 0.18, length(p));
  color = color * vignette + dust;

  gl_FragColor = vec4(color, 1.0);
}

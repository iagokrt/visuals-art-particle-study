precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float line(float d, float width) {
  return smoothstep(width, 0.0, abs(d));
}

float box(vec2 p, vec2 size) {
  vec2 d = abs(p) - size;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec2 rotateTile(vec2 uv, float id) {
  if (id < 0.25) return uv;
  if (id < 0.50) return vec2(1.0 - uv.y, uv.x);
  if (id < 0.75) return vec2(1.0 - uv.x, 1.0 - uv.y);
  return vec2(uv.y, 1.0 - uv.x);
}

float truchetArc(vec2 uv, float variant) {
  vec2 tuv = rotateTile(uv, variant);
  float a = length(tuv - vec2(0.0, 0.0));
  float b = length(tuv - vec2(1.0, 1.0));
  float c = length(tuv - vec2(0.0, 1.0));
  float d = length(tuv - vec2(1.0, 0.0));

  float arcs = line(a - 0.5, 0.018) + line(b - 0.5, 0.018);
  float alt = line(c - 0.5, 0.014) + line(d - 0.5, 0.014);
  float switcher = step(0.5, hash(floor(uv * 0.0) + variant));

  return mix(arcs, alt, switcher * 0.28);
}

float miniGrid(vec2 uv) {
  vec2 g = abs(fract(uv * 4.0) - 0.5);
  float grid = line(g.x - 0.5, 0.012) + line(g.y - 0.5, 0.012);
  float diag = line((fract(uv.x * 2.0) - fract(uv.y * 2.0)), 0.012);
  return clamp(grid * 0.40 + diag * 0.16, 0.0, 1.0);
}

float plate(vec2 uv, vec2 offset, vec2 scale, float seed) {
  vec2 local = (uv - offset) / scale;
  vec2 centered = local - 0.5;
  float frame = line(box(centered, vec2(0.49)), 0.012);
  float inside = 1.0 - smoothstep(0.0, 0.01, box(centered, vec2(0.49)));

  vec2 tileUv = local * 4.0;
  vec2 cell = floor(tileUv);
  vec2 f = fract(tileUv);
  float h = hash(cell + seed);
  float arcs = truchetArc(f, h);
  float grid = miniGrid(local);
  float innerFrame = line(box(fract(local * 2.0) - 0.5, vec2(0.48)), 0.008);

  return inside * clamp(arcs + grid + innerFrame * 0.22, 0.0, 1.0) + frame * 1.4;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 paper = vec3(0.86, 0.78, 0.63);
  vec3 stain = vec3(0.63, 0.49, 0.31);
  float grain = hash(gl_FragCoord.xy + floor(u_time * 2.0)) * 0.08;
  float age = smoothstep(0.2, 1.0, length(p)) * 0.20;
  vec3 color = paper - stain * age + grain;

  float fold = line(uv.x - 0.5, 0.010) * 0.5;
  color -= fold * vec3(0.18, 0.14, 0.09);

  float titleLine = line(uv.y - 0.90, 0.004) * smoothstep(0.18, 0.22, uv.x) * smoothstep(0.82, 0.78, uv.x);
  float pageNumbers = line(length((uv - vec2(0.16, 0.92)) * vec2(1.0, 1.8)) - 0.012, 0.003);
  pageNumbers += line(length((uv - vec2(0.84, 0.92)) * vec2(1.0, 1.8)) - 0.012, 0.003);

  float ink = 0.0;
  vec2 start = vec2(0.12, 0.62);
  vec2 size = vec2(0.17, 0.17);
  float gapX = 0.20;
  float gapY = 0.20;

  for (int y = 0; y < 3; y++) {
    for (int x = 0; x < 4; x++) {
      vec2 offset = start + vec2(float(x) * gapX, -float(y) * gapY);
      float wave = sin(u_time * 0.22 + float(x) * 0.7 + float(y) * 0.9) * 0.012 * u_intensity;
      ink += plate(uv, offset + vec2(0.0, wave), size, float(x) * 3.7 + float(y) * 11.2);
    }
  }

  float lowerBand = smoothstep(0.10, 0.13, uv.y) * smoothstep(0.30, 0.27, uv.y);
  vec2 ornamentUv = uv * vec2(18.0, 8.0);
  float ornament = line(sin(ornamentUv.x) + cos(ornamentUv.y + u_time * 0.05), 0.05) * lowerBand;
  ink += ornament * 0.35;
  ink += titleLine + pageNumbers * 0.8;

  float mouseReveal = smoothstep(0.24, 0.0, length(uv - u_mouse));
  ink += mouseReveal * 0.15;

  vec3 inkColor = vec3(0.12, 0.105, 0.075);
  color = mix(color, inkColor, clamp(ink, 0.0, 1.0) * (0.72 + u_intensity * 0.22));

  gl_FragColor = vec4(color, 1.0);
}

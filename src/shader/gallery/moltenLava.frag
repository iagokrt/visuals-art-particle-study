precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(173.1, 91.7))) * 47138.273);
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
  float amp = 0.52;
  mat2 rot = mat2(0.72, -0.69, 0.69, 0.72);

  for (int i = 0; i < 6; i++) {
    value += noise(p) * amp;
    p = rot * p * 2.15 + 8.31;
    amp *= 0.50;
  }

  return value;
}

float cellularCrack(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float nearest = 8.0;
  float second = 8.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(hash(i + g), hash(i + g + 19.7));
      o = 0.5 + 0.42 * sin(6.2831 * o + u_time * 0.12);
      vec2 r = g + o - f;
      float d = dot(r, r);

      if (d < nearest) {
        second = nearest;
        nearest = d;
      } else if (d < second) {
        second = d;
      }
    }
  }

  return sqrt(second) - sqrt(nearest);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 flow = vec2(0.0, -u_time * 0.085);
  vec2 swirl = vec2(
    fbm(p * 2.4 + flow),
    fbm(p * 2.1 - flow + 5.8)
  );
  vec2 warped = p + (swirl - 0.5) * (0.36 + u_intensity * 0.22);
  warped += (u_mouse - 0.5) * 0.08;

  float river = fbm(warped * 3.2 + flow * 2.5);
  float pulse = fbm(warped * 9.0 - flow * 5.5 + river * 1.8);
  float heat = smoothstep(0.34, 0.92, river * 0.72 + pulse * 0.58);
  float cores = smoothstep(0.70, 0.98, pulse + river * 0.22);

  float crackField = cellularCrack(warped * 8.0 + swirl * 1.7);
  float cracks = smoothstep(0.035, 0.006, crackField);
  float blackPlate = smoothstep(0.46, 0.30, heat) * (1.0 - cracks * 0.72);

  vec3 basalt = vec3(0.025, 0.021, 0.018);
  vec3 crust = vec3(0.12, 0.07, 0.045);
  vec3 ember = vec3(0.82, 0.18, 0.035);
  vec3 orange = vec3(1.0, 0.46, 0.06);
  vec3 yellow = vec3(1.0, 0.86, 0.28);

  vec3 color = mix(basalt, crust, blackPlate);
  color = mix(color, ember, heat * 0.62);
  color = mix(color, orange, smoothstep(0.42, 0.84, heat) * 0.72);
  color = mix(color, yellow, cores * (0.68 + u_intensity * 0.20));
  color += cracks * vec3(1.0, 0.34, 0.04) * (0.42 + heat * 0.55);

  float smoke = fbm(vec2(p.x * 1.8, p.y * 3.2 + u_time * 0.06) + 11.0);
  float smokeMask = smoothstep(0.54, 0.88, smoke) * smoothstep(0.18, 0.92, uv.y);
  color = mix(color, vec3(0.14, 0.11, 0.10), smokeMask * 0.20);

  float glow = exp(-abs(p.y + 0.16) * 3.2) * smoothstep(0.08, 0.78, heat);
  color += glow * vec3(0.75, 0.20, 0.03) * (0.18 + u_intensity * 0.18);

  float vignette = smoothstep(1.05, 0.24, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}

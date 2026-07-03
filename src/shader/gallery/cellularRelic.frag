precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

vec2 hash22(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return fract(sin(p) * 43758.5453123);
}

vec2 cellular(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash22(i + g);
      o = 0.5 + 0.5 * sin(u_time * 0.22 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);

      if (d < f1) {
        f2 = f1;
        f1 = d;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }

  return sqrt(vec2(f1, f2));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.7, 289.1))) * 15378.912);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 drift = vec2((u_mouse.x - 0.5) * 0.4, (u_mouse.y - 0.5) * 0.2);
  vec2 c = cellular(p * 7.0 + drift);
  vec2 cFine = cellular(p * 16.0 - drift * 1.3 + vec2(u_time * 0.04, 0.0));

  float cells = c.x;
  float borders = c.y - c.x;
  float cracks = smoothstep(0.075, 0.010, borders);
  float pores = smoothstep(0.050, 0.0, cFine.x) * 0.55;
  float plates = smoothstep(0.18, 0.62, cells);

  vec3 base = vec3(0.095, 0.085, 0.070);
  vec3 amber = vec3(0.54, 0.36, 0.15);
  vec3 bone = vec3(0.72, 0.64, 0.48);
  vec3 oxid = vec3(0.08, 0.28, 0.24);

  vec3 color = mix(base, amber, plates);
  color = mix(color, bone, smoothstep(0.42, 0.82, cells) * 0.35);
  color = mix(color, oxid, pores * 0.75);
  color -= cracks * vec3(0.12, 0.10, 0.075) * (0.9 + u_intensity * 0.6);

  float vein = smoothstep(0.025, 0.0, abs(sin((p.x + p.y) * 18.0 + cells * 5.0)));
  color += vein * cracks * vec3(0.36, 0.18, 0.06) * 0.32;

  float centerGlow = exp(-length(p) * 2.2);
  color += centerGlow * vec3(0.22, 0.14, 0.06) * (0.15 + u_intensity * 0.14);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.045;
  float vignette = smoothstep(0.92, 0.18, length(p));
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

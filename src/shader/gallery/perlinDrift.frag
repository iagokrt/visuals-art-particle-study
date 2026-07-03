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
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.78, -0.62, 0.62, 0.78);

  for (int i = 0; i < 6; i++) {
    value += perlin(p) * amp;
    p = rot * p * 2.03 + 13.1;
    amp *= 0.5;
  }

  return value * 0.5 + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 flow = vec2(u_time * 0.035, -u_time * 0.018);
  vec2 mousePull = (u_mouse - 0.5) * 0.45;
  float broad = fbm(p * 1.8 + flow + mousePull * 0.12);
  float detail = fbm(p * 5.0 - flow * 1.7 + broad * 0.8);
  float ridge = abs(perlin(p * 7.5 + vec2(u_time * 0.05, broad)));
  float strata = smoothstep(0.33, 0.78, broad + detail * 0.35);

  vec3 deep = vec3(0.045, 0.070, 0.090);
  vec3 mist = vec3(0.36, 0.49, 0.50);
  vec3 light = vec3(0.88, 0.79, 0.58);
  vec3 moss = vec3(0.17, 0.30, 0.20);

  vec3 color = mix(deep, mist, broad);
  color = mix(color, moss, smoothstep(0.48, 0.74, detail) * 0.45);
  color = mix(color, light, strata * (0.22 + u_intensity * 0.25));
  color -= ridge * vec3(0.055, 0.050, 0.040);

  float sun = exp(-length(p - vec2(0.36, 0.22)) * 4.0);
  color += sun * vec3(0.64, 0.52, 0.31) * (0.20 + u_intensity * 0.24);

  float vignette = smoothstep(0.95, 0.22, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}

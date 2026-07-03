precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash22(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return normalize(-1.0 + 2.0 * fract(sin(p) * 43758.5453123));
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);

  for (int i = 0; i < 6; i++) {
    value += amp * noise(p);
    p = rot * p * 2.02 + 11.7;
    amp *= 0.5;
  }

  return value;
}

vec2 warpField(vec2 p, float timeShift) {
  float x = fbm(p + vec2(0.0, timeShift));
  float y = fbm(p + vec2(5.2 + timeShift, 1.3));
  return vec2(x, y);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.08;
  vec2 mouseDrift = (u_mouse - 0.5) * 0.65;

  vec2 q = warpField(p * 1.18 + mouseDrift * 0.18 + t, 0.0);
  vec2 r = warpField(p * 1.76 + q * (2.25 + u_intensity * 0.70) - t, 4.2);
  vec2 s = warpField(p * 3.10 + r * 2.35 + q * 0.9, 8.4);

  vec2 warped = p;
  warped += (q - 0.5) * (0.74 + u_intensity * 0.40);
  warped += (r - 0.5) * (0.46 + u_intensity * 0.24);
  warped += (s - 0.5) * 0.18;

  float base = fbm(warped * 2.45 + vec2(t, -t * 0.7));
  float fine = fbm(warped * 6.4 + r * 2.4);
  float mist = fbm(warped * 12.0 + s * 1.6);
  float vein = sin((warped.x + warped.y * 0.42 + base * 2.25 + fine * 0.72) * 16.0);
  vein = smoothstep(0.16, 0.86, vein * 0.5 + 0.5);

  float smoke = smoothstep(0.16, 0.92, base + fine * 0.30 + mist * 0.12);
  float fold = smoothstep(0.50, 0.92, abs(fbm(warped * 4.2 + s) - 0.5) * 2.0);

  vec3 deep = vec3(0.035, 0.060, 0.060);
  vec3 teal = vec3(0.28, 0.52, 0.48);
  vec3 milk = vec3(0.78, 0.86, 0.76);
  vec3 ochre = vec3(0.58, 0.39, 0.22);
  vec3 ink = vec3(0.020, 0.025, 0.026);

  vec3 color = mix(deep, teal, smoke);
  color = mix(color, milk, vein * (0.34 + u_intensity * 0.18));
  color = mix(color, ochre, fold * 0.28);
  color = mix(color, ink, smoothstep(0.74, 1.0, 1.0 - base + mist * 0.12) * 0.40);

  float highlight = pow(max(0.0, dot(normalize(vec2(dFdx(base), dFdy(base)) + 0.001), normalize(vec2(-0.4, 0.8)))), 2.0);
  color += highlight * vec3(0.22, 0.25, 0.21) * 0.18;

  float vignette = smoothstep(1.05, 0.18, length(p));
  float grain = hash(gl_FragCoord.xy + u_time) * 0.026;
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

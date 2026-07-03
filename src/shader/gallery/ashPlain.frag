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

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.52;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 q = uv - 0.5;
  q.x *= u_resolution.x / u_resolution.y;

  float horizon = smoothstep(-0.12, 0.38, uv.y);
  float dust = fbm(vec2(uv.x * 2.2 + u_time * 0.025, uv.y * 4.5 - u_time * 0.045));
  float grain = hash(gl_FragCoord.xy + u_time) * 0.06;
  float sun = exp(-length(q - vec2(0.22, 0.12)) * 5.2);
  float vignet = smoothstep(0.92, 0.18, length(q));

  vec3 low = vec3(0.20, 0.17, 0.13);
  vec3 mid = vec3(0.72, 0.61, 0.45);
  vec3 high = vec3(1.0, 0.86, 0.56);
  vec3 color = mix(low, mid, horizon);
  color += dust * vec3(0.16, 0.13, 0.09) * u_intensity;
  color += sun * high * (0.55 + u_intensity * 0.35);
  color *= vignet;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}

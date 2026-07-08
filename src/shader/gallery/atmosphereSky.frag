precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.7, 289.3))) * 33758.5453);
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
  mat2 rot = mat2(0.86, -0.50, 0.50, 0.86);

  for (int i = 0; i < 6; i++) {
    value += noise(p) * amp;
    p = rot * p * 2.08 + 12.4;
    amp *= 0.52;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float horizon = smoothstep(0.02, 0.62, uv.y);
  vec3 zenith = vec3(0.09, 0.24, 0.58);
  vec3 upper = vec3(0.24, 0.49, 0.86);
  vec3 lower = vec3(0.94, 0.62, 0.34);
  vec3 haze = vec3(0.98, 0.86, 0.62);

  vec3 color = mix(lower, upper, horizon);
  color = mix(color, zenith, smoothstep(0.58, 1.0, uv.y) * 0.52);

  vec2 sunPos = vec2(mix(-0.42, 0.42, u_mouse.x), mix(0.06, 0.36, u_mouse.y));
  float sunDistance = length(p - sunPos);
  float sunDisc = smoothstep(0.028, 0.0, sunDistance);
  float mieGlow = exp(-sunDistance * 6.0);
  float rayleigh = pow(max(0.0, uv.y), 1.8);
  float horizonGlow = exp(-abs(uv.y - 0.43) * 6.5);

  color += haze * horizonGlow * (0.10 + u_intensity * 0.08);
  color += vec3(1.0, 0.56, 0.18) * mieGlow * (0.28 + u_intensity * 0.16);
  color += vec3(0.06, 0.18, 0.38) * rayleigh * 0.20;

  vec2 wind = vec2(u_time * 0.018, 0.0);
  vec2 cloudUv = vec2(p.x * 1.15, uv.y * 2.15);
  float highClouds = fbm(cloudUv * 2.0 + wind + vec2(2.0, 4.0));
  float softClouds = fbm(cloudUv * 4.6 - wind * 1.7 + highClouds);
  float cloudBand = smoothstep(0.22, 0.66, uv.y) * smoothstep(0.98, 0.44, uv.y);
  float cloudMask = smoothstep(0.52, 0.78, highClouds + softClouds * 0.42) * cloudBand;

  vec3 cloudShadow = vec3(0.55, 0.58, 0.63);
  vec3 cloudLight = vec3(1.0, 0.92, 0.78);
  vec3 cloudColor = mix(cloudShadow, cloudLight, smoothstep(0.22, 0.86, softClouds + mieGlow * 0.28));
  color = mix(color, cloudColor, cloudMask * (0.28 + u_intensity * 0.18));

  float groundFade = smoothstep(0.35, 0.0, uv.y);
  color = mix(color, vec3(0.21, 0.18, 0.15), groundFade * 0.20);
  color += sunDisc * vec3(1.0, 0.92, 0.64);

  float vignette = smoothstep(1.08, 0.22, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}

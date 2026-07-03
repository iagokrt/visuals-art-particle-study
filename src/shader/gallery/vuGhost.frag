precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.0, 289.0))) * 9514.1415);
}

float lineField(vec2 uv, float offset) {
  float y = uv.y + sin(uv.x * 7.0 + u_time * 0.8 + offset) * 0.045;
  return smoothstep(0.018, 0.0, abs(fract(y * 12.0 + offset) - 0.5));
}

void main() {
  vec2 uv = vUv;
  vec2 px = 1.0 / u_resolution;
  vec2 mouse = u_mouse;

  float scan = sin((uv.y + u_time * 0.035) * u_resolution.y * 0.75) * 0.5 + 0.5;
  float drift = sin(uv.y * 16.0 + u_time) * 0.012 * u_intensity;
  float ghostA = lineField(uv + vec2(drift, 0.0), 0.0);
  float ghostB = lineField(uv - vec2(drift * 0.7, 0.02), 0.37);
  float cursorWell = exp(-distance(uv, mouse) * 5.0) * 0.35;
  float noise = hash(gl_FragCoord.xy + floor(u_time * 18.0));

  vec3 base = vec3(0.03, 0.035, 0.055);
  vec3 cyan = vec3(0.28, 0.72, 0.82);
  vec3 violet = vec3(0.52, 0.32, 0.94);
  vec3 amber = vec3(1.0, 0.65, 0.28);

  vec3 color = base;
  color += cyan * ghostA * (0.65 + u_intensity * 0.22);
  color += violet * ghostB * 0.45;
  color += amber * cursorWell;
  color += scan * vec3(0.018, 0.025, 0.04);
  color += noise * px.y * 28.0;

  gl_FragColor = vec4(color, 1.0);
}

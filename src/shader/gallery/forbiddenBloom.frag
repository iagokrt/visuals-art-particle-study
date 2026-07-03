precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(113.5, 271.9))) * 24634.6345);
}

float ring(vec2 uv, vec2 center, float radius, float width) {
  float d = abs(distance(uv, center) - radius);
  return smoothstep(width, 0.0, d);
}

void main() {
  vec2 uv = vUv;
  vec2 q = uv - 0.5;
  q.x *= u_resolution.x / u_resolution.y;

  float gate = smoothstep(0.48, 0.46, abs(q.x)) * smoothstep(-0.38, 0.34, q.y);
  float floorLight = smoothstep(0.18, -0.34, q.y) * smoothstep(0.78, 0.0, abs(q.x));
  float aura = ring(uv, vec2(0.5, 0.58), 0.22 + sin(u_time * 0.28) * 0.015, 0.018);
  float bloom = exp(-length(q - vec2(0.0, 0.08)) * 3.4);
  float motes = step(0.985, hash(floor(uv * vec2(120.0, 70.0)) + floor(u_time * 5.0)));
  float cursor = exp(-distance(uv, u_mouse) * 9.0);

  vec3 night = vec3(0.015, 0.018, 0.035);
  vec3 stone = vec3(0.22, 0.24, 0.25);
  vec3 holy = vec3(0.80, 0.92, 1.0);
  vec3 forbidden = vec3(0.72, 0.52, 0.98);

  vec3 color = night;
  color = mix(color, stone, gate * 0.62);
  color += floorLight * vec3(0.12, 0.13, 0.14);
  color += bloom * holy * (0.28 + u_intensity * 0.35);
  color += aura * forbidden * (0.45 + u_intensity * 0.25);
  color += motes * holy * 0.65;
  color += cursor * forbidden * 0.12;

  gl_FragColor = vec4(color, 1.0);
}

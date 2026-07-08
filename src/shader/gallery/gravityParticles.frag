precision highp float;

varying float vDepth;

uniform float u_intensity;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float radius = length(p);
  float alpha = smoothstep(0.5, 0.08, radius);
  float core = smoothstep(0.18, 0.0, radius);

  vec3 cold = vec3(0.44, 0.68, 1.0);
  vec3 hot = vec3(1.0, 0.92, 0.68);
  vec3 color = mix(cold, hot, vDepth);
  color += core * vec3(0.55, 0.72, 1.0) * (0.45 + u_intensity * 0.25);

  gl_FragColor = vec4(color, alpha * (0.52 + u_intensity * 0.28));
}

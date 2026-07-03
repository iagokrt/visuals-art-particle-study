precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.1, 289.7))) * 13257.11);
}

float rect(vec2 p, vec2 center, vec2 size) {
  vec2 d = abs(p - center) - size;
  return 1.0 - smoothstep(0.0, 0.01, length(max(d, 0.0)) + min(max(d.x, d.y), 0.0));
}

float line(float d, float width) {
  return smoothstep(width, 0.0, abs(d));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = mix(vec3(0.015, 0.018, 0.030), vec3(0.050, 0.065, 0.090), uv.y);
  float road = smoothstep(0.55, 0.18, uv.y);
  vec3 wetAsphalt = mix(vec3(0.010, 0.012, 0.016), vec3(0.045, 0.050, 0.060), uv.y);
  color = mix(color, wetAsphalt, road);

  float perspective = smoothstep(0.18, 0.86, uv.y);
  float leftBlock = rect(uv, vec2(0.18, 0.63), vec2(0.18, 0.34));
  float rightBlock = rect(uv, vec2(0.82, 0.61), vec2(0.18, 0.36));
  color = mix(color, vec3(0.012, 0.014, 0.020), max(leftBlock, rightBlock) * 0.88);

  float windowRows = 0.0;
  for (int i = 0; i < 8; i++) {
    float y = 0.36 + float(i) * 0.065;
    windowRows += rect(uv, vec2(0.15, y), vec2(0.022, 0.010));
    windowRows += rect(uv, vec2(0.24, y + 0.02), vec2(0.024, 0.010));
    windowRows += rect(uv, vec2(0.76, y + 0.01), vec2(0.024, 0.010));
    windowRows += rect(uv, vec2(0.86, y), vec2(0.022, 0.010));
  }

  vec3 neonBlue = vec3(0.00, 0.72, 1.00);
  vec3 neonPink = vec3(1.00, 0.08, 0.72);
  color += windowRows * mix(neonBlue, neonPink, hash(floor(uv * 20.0))) * (0.12 + u_intensity * 0.12);

  float signLeft = rect(uv, vec2(0.30, 0.66), vec2(0.010, 0.18));
  float signRight = rect(uv, vec2(0.69, 0.61), vec2(0.012, 0.16));
  color += signLeft * neonPink * (0.65 + u_intensity * 0.35);
  color += signRight * neonBlue * (0.65 + u_intensity * 0.35);

  float reflection = smoothstep(0.44, 0.08, uv.y);
  color += signLeft * reflection * neonPink * 0.55;
  color += signRight * reflection * neonBlue * 0.55;
  color += line(uv.x - 0.5, 0.006) * reflection * vec3(0.55, 0.60, 0.65) * 0.18;

  float rain = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 ruv = uv * vec2(42.0 + fi * 9.0, 11.0) + vec2(fi * 4.1, u_time * (6.0 + fi * 0.8));
    float streak = line(fract(ruv.x + ruv.y * 0.18) - 0.5, 0.018);
    rain += streak * smoothstep(0.96, 0.70, fract(ruv.y));
  }
  color += rain * vec3(0.12, 0.17, 0.22) * (0.12 + u_intensity * 0.10);

  float lensDrop = smoothstep(0.09, 0.0, length((uv - u_mouse) * vec2(1.0, 1.5)));
  color = mix(color, color.bgr + vec3(0.02, 0.00, 0.04), lensDrop * 0.22);

  float grain = hash(gl_FragCoord.xy + u_time) * 0.038;
  float vignette = smoothstep(0.94, 0.18, length(p));
  color = color * vignette + grain;

  gl_FragColor = vec4(color, 1.0);
}

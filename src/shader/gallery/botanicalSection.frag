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
  return fract(sin(p) * 43758.5453123);
}

float line(float d, float width) {
  return smoothstep(width, 0.0, abs(d));
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
      o = 0.5 + 0.36 * sin(6.2831 * o + u_time * 0.08);
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

float vessel(vec2 p, vec2 center, float radius, float squash) {
  vec2 q = p - center;
  q.x *= squash;
  return length(q) - radius;
}

float vesselField(vec2 p) {
  float d = 4.0;
  d = min(d, vessel(p, vec2(-0.38, 0.10), 0.145, 0.86));
  d = min(d, vessel(p, vec2(-0.18, 0.36), 0.095, 1.24));
  d = min(d, vessel(p, vec2(0.15, 0.18), 0.160, 0.94));
  d = min(d, vessel(p, vec2(0.42, 0.08), 0.098, 1.18));
  d = min(d, vessel(p, vec2(-0.40, -0.24), 0.118, 1.12));
  d = min(d, vessel(p, vec2(-0.05, -0.31), 0.125, 0.82));
  d = min(d, vessel(p, vec2(0.30, -0.32), 0.138, 1.06));
  d = min(d, vessel(p, vec2(0.02, 0.47), 0.040, 1.0));
  d = min(d, vessel(p, vec2(0.47, -0.18), 0.055, 1.2));
  d = min(d, vessel(p, vec2(-0.55, -0.02), 0.050, 0.8));
  d = min(d, vessel(p, vec2(-0.24, -0.52), 0.060, 1.0));
  d = min(d, vessel(p, vec2(0.12, -0.55), 0.050, 1.35));
  return d;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float radius = length(p);
  float section = smoothstep(0.74, 0.69, radius);
  float outside = 1.0 - section;

  vec3 paper = vec3(0.94, 0.90, 0.80);
  float grain = hash(gl_FragCoord.xy + floor(u_time * 1.5)) * 0.055;
  vec3 color = paper + grain;

  vec2 warp = p;
  warp += 0.015 * vec2(
    sin(p.y * 18.0 + u_time * 0.18),
    cos(p.x * 15.0 - u_time * 0.12)
  ) * u_intensity;

  float ringA = line(radius - 0.68, 0.010);
  float ringB = line(radius - 0.55, 0.007);
  float ringC = line(radius - 0.39, 0.006);

  vec2 cellOuter = cellular(warp * 18.0);
  vec2 cellInner = cellular(warp * 31.0 + vec2(4.0, 1.7));
  vec2 cellCore = cellular(warp * 42.0 - vec2(2.2, 5.5));

  float outerWalls = smoothstep(0.050, 0.010, cellOuter.y - cellOuter.x);
  float innerWalls = smoothstep(0.042, 0.008, cellInner.y - cellInner.x);
  float coreWalls = smoothstep(0.034, 0.006, cellCore.y - cellCore.x);

  float outerZone = smoothstep(0.76, 0.54, radius) * smoothstep(0.43, 0.56, radius);
  float midZone = smoothstep(0.60, 0.34, radius) * smoothstep(0.18, 0.40, radius);
  float coreZone = smoothstep(0.44, 0.12, radius);

  float cells = outerWalls * outerZone + innerWalls * midZone + coreWalls * coreZone;

  float vd = vesselField(warp);
  float vesselWall = line(vd, 0.010) + line(vd + 0.018, 0.006) * 0.55;
  float vesselHole = smoothstep(0.018, -0.004, vd);
  float vesselHalo = smoothstep(0.085, 0.0, abs(vd)) * smoothstep(0.50, 0.15, radius);

  vec3 ink = vec3(0.125, 0.105, 0.070);
  vec3 ochre = vec3(0.58, 0.42, 0.10);
  vec3 faint = vec3(0.62, 0.52, 0.35);

  color = mix(color, vec3(0.98, 0.96, 0.90), section * 0.82);
  color = mix(color, faint, cells * section * 0.42);
  color = mix(color, ink, cells * section * (0.36 + u_intensity * 0.20));
  color = mix(color, ochre, vesselHalo * section * 0.22);
  color = mix(color, ink, vesselWall * section);
  color = mix(color, vec3(0.985, 0.975, 0.94), vesselHole * section);

  color = mix(color, ink, (ringA + ringB * 0.7 + ringC * 0.45) * 0.75);

  float guideA = line(uv.x - 0.83, 0.002) * smoothstep(0.34, 0.36, uv.y) * smoothstep(0.74, 0.72, uv.y);
  float labelTicks = 0.0;
  for (int i = 0; i < 5; i++) {
    float fy = 0.38 + float(i) * 0.075;
    labelTicks += line(uv.y - fy, 0.002) * smoothstep(0.79, 0.81, uv.x) * smoothstep(0.89, 0.87, uv.x);
  }
  color = mix(color, ink, (guideA + labelTicks) * 0.52);

  float mouseLens = smoothstep(0.16, 0.0, length(uv - u_mouse));
  color = mix(color, vec3(0.76, 0.58, 0.16), mouseLens * cells * 0.20);

  color = mix(color, paper, outside * 0.55);

  gl_FragColor = vec4(color, 1.0);
}

precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_legacy_a;
uniform float u_legacy_b;
uniform float u_legacy_c;
uniform sampler2D u_texture;
uniform sampler2D u_texture_alt;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(91.7, 47.3))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 grid = mix(vec2(70.0, 105.0), vec2(230.0, 345.0), u_legacy_a);
  vec2 cell = floor(uv * grid);
  vec2 local = fract(uv * grid) - 0.5;

  float transition = mix(sin(u_time * 0.35) * 0.5 + 0.5, u_legacy_c, 0.75);
  vec2 jitter = vec2(hash(cell), hash(cell + 3.7)) - 0.5;
  float scatter = smoothstep(0.0, 0.75, u_intensity) * mix(0.002, 0.055, u_legacy_b);
  vec2 sampleUv = uv + jitter * scatter + sin(uv.yx * 12.0 + u_time) * 0.004;

  vec3 a = texture2D(u_texture, sampleUv).rgb;
  vec3 b = texture2D(u_texture_alt, sampleUv).rgb;
  vec3 image = mix(a, b, transition);

  float luma = dot(image, vec3(0.299, 0.587, 0.114));
  float dotRadius = mix(0.045, 0.38, luma) * mix(0.72, 1.35, u_legacy_a);
  float dotShape = smoothstep(dotRadius, dotRadius - 0.08, length(local));
  float mouseGlow = exp(-distance(uv, u_mouse) * 7.0);

  vec3 particle = image * dotShape;
  particle += mouseGlow * vec3(0.08, 0.14, 0.20);
  particle += hash(gl_FragCoord.xy + floor(u_time * 12.0)) * 0.025;

  gl_FragColor = vec4(particle, 1.0);
}

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
uniform sampler2D u_displacement;

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

  vec4 displace = texture2D(u_displacement, uv);
  float relief = displace.r;
  float breath = sin(u_time * mix(0.1, 1.2, u_legacy_c) + relief * 5.0) * 0.018 * u_intensity;
  vec2 warped = uv + normalize(centered + 0.0001) * (relief - 0.5) * mix(0.02, 0.20, u_legacy_a) * u_intensity;
  warped += vec2(breath, -breath * 0.5);

  vec3 image = texture2D(u_texture, warped).rgb;
  float shade = smoothstep(0.18, 0.92, relief);
  float aura = exp(-distance(uv, u_mouse) * 6.0);
  float vertical = smoothstep(0.0, 1.0, uv.y);

  vec3 stone = mix(vec3(0.16, 0.15, 0.14), vec3(0.64, 0.58, 0.50), shade);
  vec3 color = mix(stone, image, mix(0.25, 0.92, u_legacy_b));
  color += vec3(0.28, 0.22, 0.15) * vertical * 0.18;
  color += aura * vec3(0.16, 0.11, 0.06);

  gl_FragColor = vec4(color, 1.0);
}

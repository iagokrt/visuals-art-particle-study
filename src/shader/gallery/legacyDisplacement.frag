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
  vec4 map = texture2D(u_displacement, uv.yx);

  float wave = sin(uv.y * (10.0 + u_legacy_c * 22.0) + u_time * 1.2) * 0.025;
  float pull = (map.r - 0.5) * (0.08 + u_legacy_a * 0.52) * u_intensity;
  float mouse = exp(-distance(uv, u_mouse) * 7.0) * 0.08 * u_legacy_b;

  vec2 displaced = uv;
  displaced.x += pull + wave * u_intensity;
  displaced.y = mix(uv.y, map.r - 0.18, (0.08 + u_legacy_a * 0.52) * u_intensity) + mouse;

  vec4 color;
  color.r = texture2D(u_texture, displaced + vec2(0.0, 0.026) * u_legacy_b * u_intensity).r;
  color.g = texture2D(u_texture, displaced + vec2(0.0, 0.010) * u_legacy_b * u_intensity).g;
  color.b = texture2D(u_texture, displaced - vec2(0.0, 0.018) * u_legacy_b * u_intensity).b;
  color.a = 1.0;

  float vignette = smoothstep(0.92, 0.16, length((uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0)));
  color.rgb *= vignette;

  gl_FragColor = color;
}

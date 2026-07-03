varying vec2 vUv;
varying vec3 vWorld;

uniform float u_time;
uniform float u_breath;

void main() {
  vUv = uv;

  vec3 p = position;
  float wave = sin((p.x * 2.1) + u_time * 0.65) * 0.018;
  float pulse = sin((p.y * 3.0) - u_time * 0.38) * 0.012;
  p.z += (wave + pulse) * u_breath;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}

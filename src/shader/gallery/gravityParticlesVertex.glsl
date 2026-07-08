attribute float aIndex;

uniform float u_width;
uniform float u_height;
uniform float u_particleSize;
uniform sampler2D u_positionTexture;

varying float vDepth;

void main() {
  vec2 uv = vec2(
    (mod(aIndex, u_width) + 0.5) / u_width,
    (floor(aIndex / u_width) + 0.5) / u_height
  );

  vec4 particlePosition = texture2D(u_positionTexture, uv);
  vec4 mvPosition = modelViewMatrix * particlePosition;
  vDepth = smoothstep(9.0, -3.0, mvPosition.z);

  gl_PointSize = clamp(-u_particleSize / mvPosition.z, 1.0, 18.0);
  gl_Position = projectionMatrix * mvPosition;
}

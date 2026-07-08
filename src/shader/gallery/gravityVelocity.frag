precision highp float;

uniform float u_dt;
uniform float u_gravity;
uniform float u_softening;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 position = texture2D(u_positionTexture, uv).xyz;
  vec3 velocity = texture2D(u_velocityTexture, uv).xyz;

  vec3 totalForce = vec3(0.0);
  float nParticles = resolution.x * resolution.y;
  float forceScalingFactor = u_gravity / (2.0 * pow(nParticles, 1.5));

  for (float i = 0.0; i < 4096.0; i++) {
    if (i >= nParticles) {
      break;
    }

    vec2 particleUv = vec2(mod(i, resolution.x) + 0.5, floor(i / resolution.x) + 0.5) / resolution.xy;
    vec3 particlePosition = texture2D(u_positionTexture, particleUv).xyz;
    vec3 forceDirection = particlePosition - position;
    float distanceToParticle = length(forceDirection);

    if (distanceToParticle <= 0.0001) {
      continue;
    }

    totalForce += forceScalingFactor * (forceDirection / distanceToParticle) / pow(distanceToParticle + u_softening, 2.0);
  }

  velocity += u_dt * totalForce;
  velocity *= 0.999;

  gl_FragColor = vec4(velocity, 1.0);
}

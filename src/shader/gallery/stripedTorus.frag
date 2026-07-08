precision highp float;

varying vec3 vPosition;
varying vec3 vNormal;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;

float diffuseFactor(vec3 normal, vec3 lightDirection) {
  float df = dot(normalize(normal), normalize(lightDirection));

  if (gl_FrontFacing) {
    df = -df;
  }

  return max(0.0, df);
}

void main() {
  vec2 mouse = u_mouse - 0.5;
  vec3 lightDirection = -vec3(mouse * 1.65, 0.62);
  vec3 normal = normalize(vNormal);

  float stripePhase = vPosition.y * 18.0 + vPosition.x * 2.2 + sin(vPosition.z * 5.0) * 0.85;
  float stripe = cos(stripePhase + u_time * (1.6 + u_intensity * 0.75));

  if (stripe < -0.08) {
    discard;
  }

  float df = diffuseFactor(normal, lightDirection);
  float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.2);
  float cutShade = smoothstep(-0.08, 0.22, stripe);

  vec3 graphite = vec3(0.08, 0.08, 0.075);
  vec3 pearl = vec3(0.88, 0.88, 0.82);
  vec3 color = mix(graphite, pearl, df * 0.82 + rim * 0.28);
  color *= 0.62 + cutShade * 0.48;

  gl_FragColor = vec4(color, 1.0);
}

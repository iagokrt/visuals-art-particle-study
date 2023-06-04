varying vec2 vUv;

uniform float time;
uniform sampler2D image;
uniform sampler2D displacement;


void main() {
  vec4 displace = texture2D(displacement, vUv);
  vec2 displacedUV = vec2(vUv.x + .1*(sin(vUv.y*19. + time)), vUv.y);

  vec4 color = texture2D(image, displacedUV);

  gl_FragColor = color;

}
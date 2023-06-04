varying vec2 vUv;

uniform sampler2D image;
uniform sampler2D displacement;


void main() {
  vec4 displace = texture2D(displacement, vUv);
  vec2 displacedUV = vec2(vUv.x+ 2., vUv.y);

  vec4 color = texture2D(image, displacedUV);

  gl_FragColor = color;

}
varying vec2 vUv;

uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;


void main() {
  vec4 displace = texture2D(displacement, vUv);
  vec2 displacedUV = vec2(vUv.x + progress*.1*(sin(vUv.y*13. + time/4.)), vUv.y);

  vec4 color = texture2D(image, displacedUV);

  gl_FragColor = color;

}
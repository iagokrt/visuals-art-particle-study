varying vec2 vUv;

uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;


void main() {
  vec4 displace = texture2D(displacement, vUv.yx);
  vec2 displacedUV = vec2(
    vUv.x , 
    vUv.y
  );

  displacedUV.y = mix(vUv.y, displace.r -.2 ,progress);


  vec4 color = texture2D(image, displacedUV);

  color.r = texture2D(image, displacedUV+ vec2(0., 10.*0.005)*progress).r;
  color.g = texture2D(image, displacedUV+ vec2(0., 10.*0.01)*progress).g;
  color.b = texture2D(image, displacedUV+ vec2(0., 10.*0.02)*progress).b;

  gl_FragColor = color;

}
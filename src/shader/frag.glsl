varying vec2 vUv;

uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;


void main() {
  vec4 displace = texture2D(displacement, vUv.yx);
  vec2 displacedUV = vec2(
    vUv.x,
    vUv.y 
    // displacedUV (defaults): vUv.x, vUv.y
    // (tests): x = vUv.x + progress*0.8*sin(vUv.y*14. + time/2.), 
    // (tests): x = vUv.x + displace.r*progress*sin(vUv.y+time/4.), 
    // (tests): y = vUv.y+ .2 *sin(vUv.y*7. + time/4.) 
    // (tests): y = vUv.y + progress*(displace.r+.02)*sin(vUv.x+time/4.)
  );
  displacedUV.y = mix(vUv.y, displace.r -.2 ,progress);

  vec4 color = texture2D(image, displacedUV);

  color.r = texture2D(image, displacedUV+ vec2(0., 10.*0.005)*progress).r;
  color.g = texture2D(image, displacedUV+ vec2(0., 10.*0.01)*progress).g;
  color.b = texture2D(image, displacedUV+ vec2(0., 10.*0.02)*progress).b;

  gl_FragColor = color;

}
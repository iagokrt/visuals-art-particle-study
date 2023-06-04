varying vec2 vUv;

uniform sampler2D image;

void main() {

  vec4 color = texture2D(image, vUv);

  gl_FragColor = vec4(1., 0., 0., 1.);
  gl_FragColor = vec4(color);

}
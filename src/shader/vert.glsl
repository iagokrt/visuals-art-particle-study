varying vec2 vUv;
uniform sampler2D image;

void main (){
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);

  gl_PointSize = 15. * (1./-mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
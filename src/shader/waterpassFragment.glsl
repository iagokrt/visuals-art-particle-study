uniform float time;
uniform float u_progress;
uniform sampler2D u_texture;
uniform vec4 u_resolution;
// uniform float u_fragColorRate;

varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main() {

     vec4 textureUv = texture2D(u_texture, vUv);
     gl_FragColor = vec4(vUv, 0., 1.);

     gl_FragColor = textureUv;
}
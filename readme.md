# three.js studies

## Important Notes!

- works with sass only with this specific version of node: 14.21.0
- you can use nvm list to see what version of node you are using. then install with nvm install 14 to go with node 14
- you can also disable scss pre-processing and go with vanilla css if you change a bit of settings


## Using Custom Materials!

```js
const custom_shaderMaterial = new THREE.ShaderMaterial({
  extensions: {
    derivatives: '#extension GL_OES_standard_derivatives :enable',
  },
  uniforms: {
    time: { type: 'f', value: 0 }, // distortions based on time
    u_progress: { type: 'f', value: 0 }, // use progress on settings
    u_distortion: { type: 'f', value: 0 }, // use distortion combined with noise funcions
    u_texture: {
      type: 't',
      value: new THREE.TextureLoader().load(texture), // loading texture with shader
    },
    u_resolution: { type: 'v4', value: new THREE.Vector4() },
    u_fragColorRate: { type: 'f', value: 0 },
    uvRate1: {
      value: new THREE.Vector2(1, 1),
    },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
});


```


## Scene definitions

```js
const bloomSettings = {
  resolution: {
    w: window.innerWidth,
    h: window.innerHeight
  }, 
  strength: 1.5, 
  radius: 0.4, 
  threshold: 0.85
}

const scene = {
  objects: {
    names: {
      customPoints: 'red_shader',
      blueShader: 'blue_shader'
    },
    geometries: {
      plane: new THREE.PlaneBufferGeometry(
        480 * 1.75,
        820 * 1.75,
        480,
        820
      )
    },
    materials: {
      shader: new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives :enable',
        },
        uniforms: {
          time: { type: 'f', value: 0 },
          u_progress: { type: 'f', value: 0 },
          u_distortion: { type: 'f', value: 0 },
          u_texture: {
            type: 't',
            value: new THREE.TextureLoader().load(texture),
          },
          u_resolution: { type: 'v4', value: new THREE.Vector4() },
          u_fragColorRate: { type: 'f', value: 0 },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      })
    },
    cameras: {
      default: new THREE.PerspectiveCamera (
        70,
        window.innerWidth / window.innerHeight,
        0.001,
        5000
      ),
      perspectiveCamera: new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.001,
        5000
      )
    },
    lights: {
      ambient: new THREE.AmbientLight(0x00ff00, 1)
    }
  },
  postProcessing: {
    bloomPass: new UnrealBloomPass(
      new THREE.Vector2(bloomSettings.resolution.w, bloomSettings.resolution.h),
      bloomSettings.strength,
      bloomSettings.radius,
      bloomSettings.threshold
    )
  }
}
```

## Basic Shader display Texture

```glsl 
// fragment
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
```

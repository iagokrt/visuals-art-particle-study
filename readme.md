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

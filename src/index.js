import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

// post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})() // stats from https://github.com/mrdoob/stats.js/

import * as dat from 'dat.gui';
// import Stats from 'stats.js';
import gsap from 'gsap';

import './styles/global.scss';

import texture from '../public/a-end.jpg'; // end frame of video : the texture that will be used itself with the fragment uniforms
import texture2 from '../public/b-end.jpg'; // end frame of video : the texture that will be used itself with the fragment uniforms
import perro from '../public/perro.jpeg'; 

import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';

import vertex__w from './shader/waterpassVertex.glsl';
import fragment__w from './shader/waterpassFragment.glsl';

import vert from './shader/vert.glsl';
import frag from './shader/frag.glsl';

import {addObjectClickListener} from './component/addObjectClickListener'

const shaderSettings = {
  vertex: vertex,
  fragment: fragment,
  uniforms: {
    texture: texture
  },
}

const shaderSettings2 = {
  vertex: vertex__w,
  fragment: fragment__w,
  uniforms: {
    texture: texture2
  },
}

const shaderSettings3 = {
  vertex: vert,
  fragment: frag,
  uniforms: {
    texture: perro
  },
}

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
      blueShader: 'blue_shader',
      perro: 'perro'
    },
    geometries: {
      plane: new THREE.PlaneBufferGeometry(
        480 * 1.75,
        820 * 1.75,
        480,
        820
      ),
      simplePlane: new THREE.PlaneGeometry( 200, 200, 2, 2 ),
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
            value: new THREE.TextureLoader().load(shaderSettings.uniforms.texture),
          },
          u_resolution: { type: 'v4', value: new THREE.Vector4() },
          u_fragColorRate: { type: 'f', value: 0 },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        vertexShader: shaderSettings.vertex,
        fragmentShader: shaderSettings.fragment,
      }),
      shader2: new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives :enable',
        },
        uniforms: {
          time: { type: 'f', value: 0 },
          u_progress: { type: 'f', value: 0 },
          u_distortion: { type: 'f', value: 0 },
          u_texture: {
            type: 't',
            value: new THREE.TextureLoader().load(shaderSettings2.uniforms.texture),
          },
          u_resolution: { type: 'v4', value: new THREE.Vector4() },
          u_fragColorRate: { type: 'f', value: 0 },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        vertexShader: shaderSettings2.vertex,
        fragmentShader: shaderSettings2.fragment,
      }),
      simpleShader: new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives :enable',
        },
        uniforms: {
          progress: { type : "f", value: 0 },
          image: {
            type: 't',
            value: new THREE.TextureLoader().load(shaderSettings3.uniforms.texture),
          },
          resolution: { type: 'v4', value: new THREE.Vector4() },
          fragColorRate: { type: 'f', value: 0 },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        vertexShader: shaderSettings3.vertex,
        fragmentShader: shaderSettings3.fragment,
      })
    },
    meshes: {
      // textureMesh: new THREE.Plane(), e.g.
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
  },
  background: {
    default: {
      color: 0x000000,
      a: 1
    }
  }
}

export default class Particled {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom; // document.getElementById('webgl')
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(scene.background.default.color, 1);
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera = scene.objects.cameras.perspectiveCamera;

    this.camera.position.set(0, 0, 5050);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.menuItems1 = document.querySelector('.link-01');
    this.menuItems2 = document.querySelector('.link-02');
    this.menuItems3 = document.querySelector('.link-03');

    // video events (timeline)
    // this.video = document.getElementById('video1');
    // this.video2 = document.getElementById('video2');

    this.isPlaying = true;

    this.addPostProcessing();

    this.addRedDistortions();
    this.addWaterEffect();
    this.addSimpleTexture();
    this.addLights();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
    this.menuSettings();

  }

  addPostProcessing() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = scene.postProcessing.bloomPass;

    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  settings() {
    let that = this;
    this.settings = {
      distortion: 0.0,
      bloomStrength: .00,
    };

    this.gui = new dat.GUI();
    
    this.gui.add(this.settings, 'bloomStrength', 0, 2.5, 0.005);

    this.folderPost = this.gui.addFolder('Post Processing')

    this.folderPost.add(this.settings, 'distortion', 0, 3, 0.01);
    // this.folderPost.add(this.settings, 'bloomStrength', 0, 2.5, 0.0005);

    this.folderPost.open();

  }

  addToScene(object) {
    this.scene.add(object);
  }

  removeFromScene(object) {
    this.scene.remove(object);
  }

  menuSettings() {
    this.menuItems1.addEventListener('click', () => {
      this.addToScene(this.plane);
    })
    
    this.menuItems2.addEventListener('click', () => {
      if (this.scene.getObjectByName(scene.objects.names.customPoints)) { 
        this.removeFromScene(this.plane);
        this.addToScene(this.waterEffect);
      } 
    })

    this.menuItems3.addEventListener('click', () => {
      // alert('new simplex texture loader');
      console.log('new simplex texture loader');
      this.addToScene(this.perro);
    })
    
  }

  addSimpleTexture() {
    this.geometry__s = scene.objects.geometries.simplePlane;

    this.material__s = scene.objects.materials.simpleShader;
    // this.material__s = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.perro = new THREE.Mesh( this.geometry__s, this.material__s );

    this.perro.name = scene.objects.names.perro;
  }

  addWaterEffect() {
    this.material__w = scene.objects.materials.shader2;

    this.geometry__w = scene.objects.geometries.plane;

    this.waterEffect = new THREE.Points(this.geometry__w, this.material__w);
    this.waterEffect.name = scene.objects.names.blueShader;
  }

  addGenericObject(material, geometry, name) {
    this.material = material;
    this.geometry = geometry;

    // object
    this.plane = new THREE.Points(geometry, material);
    this.plane.name = name;
  }

  addRedDistortions() {
    // console.log(`reference this ${this}`, this);
    
    this.addGenericObject(scene.objects.materials.shader, scene.objects.geometries.plane, scene.objects.names.customPoints);
  }

  addLights() {
    this.ambient = scene.objects.lights.ambient;

    this.scene.add( this.ambient );
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;

    // this.stats.update();

    this.material.uniforms.time.value = this.time;
    // this.material.uniforms.u_distortion.value = this.settings.distortion;

    this.bloomPass.strength = this.settings.bloomStrength;
    
    this.material__w.uniforms.time.value = this.time;
    // this.material__w.uniforms.u_distortion.value = this.settings.distortion;

    // this.perro.rotation.x = this.time / 50;
    // this.perro.rotation.y = this.time / 100;

    requestAnimationFrame(this.render.bind(this));
    // this.renderer.render(this.scene, this.camera); // using the composer with bloom post
    this.composer.render();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
    this.composer.setSize(this.width, this.height);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

}

new Particled({
  dom: document.getElementById('webgl'),
});

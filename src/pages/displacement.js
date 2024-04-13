import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import dat from 'dat.gui';

import '../styles/global.scss';

import perro from '../../public/perro.png'; 
import displacement from '../../public/displacement.png'; 

import vert from '../shader/vert.glsl';
import frag from '../shader/frag.glsl';

const shaderSettings = {
  vertex: vert,
  fragment: frag,
  uniforms: {
    texture: perro,
    displacement: displacement
  },
}

const scene = {
  objects: {
    geometries: {
      plane: new THREE.PlaneBufferGeometry(
        480 * 1.75,
        820 * 1.75,
        480,
        820
      ),
      simplePlane: new THREE.PlaneGeometry( 1500, 1500, 2, 2 ),
    },
    materials: {
      simpleShader: new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives :enable',
        },
        side: THREE.DoubleSide,
        uniforms: {
          progress: { type : "f", value: 0 },
          time: { type: 'f', value: 0 },
          image: {
            type: 't',
            value: new THREE.TextureLoader().load(shaderSettings.uniforms.texture),
          },
          displacement: {
            type: 't',
            value: new THREE.TextureLoader().load(shaderSettings.uniforms.displacement),
          },
          resolution: { type: 'v4', value: new THREE.Vector4() },
          fragColorRate: { type: 'f', value: 0 },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        vertexShader: shaderSettings.vertex,
        fragmentShader: shaderSettings.fragment,
      })
    },
    cameras: {
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
  }
}


export default class Displacement {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      5000
    )

    this.camera.position.set(0, 0, 1850);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.isPlaying = true;

    this.initScene();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
  }


  // dispose() {
  //   // this.disposeHierarchy(this.scene, this.disposeNode);
  //   console.log('dispose all')
  //   // Remover todos os objetos da cena
  //   this.scene.children.forEach(child => {
  //     this.scene.remove(child);
  //   });
  // }

  settings() {
    let that = this;
    this.settings = {
      distortion: 0.0,
      bloomStrength: .00,
      progress: 0,
    };

    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  }

  initScene() {
    this.geometry_ = scene.objects.geometries.simplePlane;
    this.material_ = scene.objects.materials.simpleShader;
    // this.material_ = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.perro = new THREE.Mesh( this.geometry_, this.material_ );
    this.perro.name = 'perro';
    this.scene.add(this.perro);

    this.ambient = new THREE.AmbientLight(0x00ff00, 1)
    this.scene.add( this.ambient );

  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
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
  }

}

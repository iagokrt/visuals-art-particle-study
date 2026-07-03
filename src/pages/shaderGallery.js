import * as THREE from 'three';

import '../styles/global.scss';

import vertex from '../shader/gallery/studyVertex.glsl';
import ashPlain from '../shader/gallery/ashPlain.frag';
import vuGhost from '../shader/gallery/vuGhost.frag';
import furColossus from '../shader/gallery/furColossus.frag';
import forbiddenBloom from '../shader/gallery/forbiddenBloom.frag';
import stormSilhouette from '../shader/gallery/stormSilhouette.frag';
import memoryLake from '../shader/gallery/memoryLake.frag';
import heatMirage from '../shader/gallery/heatMirage.frag';
import legacyDisplacement from '../shader/gallery/legacyDisplacement.frag';
import legacyVideoParticles from '../shader/gallery/legacyVideoParticles.frag';
import legacySculpture from '../shader/gallery/legacySculpture.frag';

import perro from '../../public/perro.png';
import displacement from '../../public/displacement.png';
import aEnd from '../../public/a-end.jpg';
import bEnd from '../../public/b-end.jpg';
import freddie from '../../public/freddie-marriage-w39PTDxKiK8-unsplash.jpg';

const studies = [
  {
    id: 'ash',
    title: 'Ash Plain',
    tag: 'fog / dust / harsh sun',
    source: 'new study',
    fragment: ashPlain,
    note: 'Paisagem lavada, horizonte de pó e sol estourado. Base para deserto, planície proibida ou escala monumental.',
  },
  {
    id: 'vu',
    title: 'VU Ghost',
    tag: 'scan / memory / vector unit',
    source: 'new study',
    fragment: vuGhost,
    note: 'Linhas instáveis, fantasma de framebuffer e sensação de hardware antigo respirando por baixo.',
  },
  {
    id: 'fur',
    title: 'Colossus Fur',
    tag: 'organic noise / giant body',
    source: 'new study',
    fragment: furColossus,
    note: 'Ruído orgânico para estudar massa, pelo, pedra e musgo sem depender de textura externa.',
  },
  {
    id: 'bloom',
    title: 'Forbidden Bloom',
    tag: 'shrine / aura / sacred light',
    source: 'new study',
    fragment: forbiddenBloom,
    note: 'Luz de templo, partículas e bloom fantasmático para cenas ritualísticas e menus diegéticos.',
  },
  {
    id: 'storm',
    title: 'Storm Silhouette',
    tag: 'side profile / rain / negative space',
    source: 'new study',
    fragment: stormSilhouette,
    note: 'Composição lateral, chuva e recorte de silhueta. Bom para estudar leitura imediata, solidão e tensão sem excesso de detalhe.',
  },
  {
    id: 'lake',
    title: 'Memory Lake',
    tag: 'reflection / slow water / mourning',
    source: 'new study',
    fragment: memoryLake,
    note: 'Água lenta e reflexo quebrado, mais contemplativo. Serve para testar pausa, travessia e imagem emocional.',
  },
  {
    id: 'mirage',
    title: 'Heat Mirage',
    tag: 'desert lens / heat distortion',
    source: 'new study',
    fragment: heatMirage,
    note: 'Distorção por calor, brilho baixo e horizonte tremendo. Um estudo essencial para escala, distância e sensação de ar pesado.',
  },
  {
    id: 'legacy-displacement',
    title: 'Legacy Displace',
    tag: 'original study / image warp',
    source: 'legacy adapted',
    fragment: legacyDisplacement,
    texture: perro,
    displacement,
    legacyControls: [
      { uniform: 'u_legacy_a', label: 'Força do mapa', value: 0.62 },
      { uniform: 'u_legacy_b', label: 'Aberração', value: 0.55 },
      { uniform: 'u_legacy_c', label: 'Ondulação', value: 0.42 },
    ],
    note: 'Adaptação do teu estudo de displacement: imagem, mapa de deslocamento e aberração cromática virando material de transição.',
  },
  {
    id: 'legacy-particles',
    title: 'Legacy Particles',
    tag: 'original study / video frames',
    source: 'legacy adapted',
    fragment: legacyVideoParticles,
    texture: aEnd,
    textureAlt: bEnd,
    legacyControls: [
      { uniform: 'u_legacy_a', label: 'Densidade', value: 0.55 },
      { uniform: 'u_legacy_b', label: 'Dispersão', value: 0.38 },
      { uniform: 'u_legacy_c', label: 'Mistura A/B', value: 0.42 },
    ],
    note: 'Adaptação do estudo de vídeo em partículas: os frames originais viram uma malha de pontos respirando e trocando de imagem.',
  },
  {
    id: 'legacy-sculpture',
    title: 'Legacy Sculpture',
    tag: 'original study / relief surface',
    source: 'legacy adapted',
    fragment: legacySculpture,
    texture: freddie,
    displacement,
    legacyControls: [
      { uniform: 'u_legacy_a', label: 'Relevo', value: 0.58 },
      { uniform: 'u_legacy_b', label: 'Imagem base', value: 0.72 },
      { uniform: 'u_legacy_c', label: 'Pulso', value: 0.32 },
    ],
    note: 'Adaptação do estudo de escultura: textura fotográfica, relevo e distorção suave para pensar matéria, corpo e superfície.',
  },
];

const cameraPresets = [
  {
    id: 'monumental-low',
    title: 'Monumental Low',
    tag: 'low angle / giant scale',
    fov: 42,
    position: [0, -0.74, 2.36],
    target: [0, 0.16, 0],
    meshRotation: [-0.13, 0, 0],
    meshScale: 1.18,
  },
  {
    id: 'distant-wide',
    title: 'Distant Wide',
    tag: 'lonely travel / negative space',
    fov: 32,
    position: [0, 0.05, 3.38],
    target: [0, 0, 0],
    meshRotation: [0, 0, 0],
    meshScale: 0.88,
  },
  {
    id: 'fixed-horror',
    title: 'Fixed Horror',
    tag: 'fixed corner / authored tension',
    fov: 46,
    position: [-1.35, 0.66, 2.35],
    target: [0.06, -0.05, 0],
    meshRotation: [0.03, -0.18, 0.02],
    meshScale: 1.1,
  },
  {
    id: 'tactical-iso',
    title: 'Tactical Iso',
    tag: 'readability / map thinking',
    fov: 36,
    position: [1.45, 1.14, 2.24],
    target: [0, 0, 0],
    meshRotation: [-0.34, 0.24, -0.03],
    meshScale: 1.12,
  },
  {
    id: 'shrine-symmetry',
    title: 'Shrine Symmetry',
    tag: 'centered / ritual / altar',
    fov: 28,
    position: [0, 0, 3],
    target: [0, 0, 0],
    meshRotation: [0, 0, 0],
    meshScale: 0.96,
  },
];

export default class ShaderGallery {
  constructor(options) {
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.time = 0;
    this.activeIndex = 0;
    this.activeCameraIndex = 0;
    this.mouse = new THREE.Vector2(0.5, 0.5);
    this.isPlaying = true;
    this.textureLoader = new THREE.TextureLoader();
    this.textures = {};

    this.createScene();
    this.loadTextures();
    this.createStudies();
    this.createInterface();
    this.setCameraPreset(this.activeCameraIndex);
    this.bindEvents();
    this.resize();
    this.render();
  }

  loadTextures() {
    const textureUrls = [perro, displacement, aEnd, bEnd, freddie];

    textureUrls.forEach((url) => {
      const texture = this.textureLoader.load(url);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      this.textures[url] = texture;
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.01, 20);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x05060a, 1);
    this.container.appendChild(this.renderer.domElement);
  }

  createStudies() {
    this.geometry = new THREE.PlaneBufferGeometry(3.4, 2.05, 160, 120);

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: studies[this.activeIndex].fragment,
      side: THREE.DoubleSide,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(this.width, this.height) },
        u_mouse: { value: this.mouse },
        u_intensity: { value: 0.72 },
        u_breath: { value: 0.65 },
        u_texture: { value: this.textures[perro] },
        u_texture_alt: { value: this.textures[bEnd] },
        u_displacement: { value: this.textures[displacement] },
        u_legacy_a: { value: 0.5 },
        u_legacy_b: { value: 0.5 },
        u_legacy_c: { value: 0.5 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.applyStudyUniforms(studies[this.activeIndex]);
  }

  createInterface() {
    this.root = document.createElement('section');
    this.root.className = 'shader-atlas';
    this.root.innerHTML = `
      <div class="atlas-hero">
        <p class="eyebrow">shader field notes</p>
        <h1>Arqueologia visual para um jogo design-first</h1>
        <p class="lead">Uma pequena biblioteca de fragment shaders: estudos procedurais novos e adaptações dos experimentos originais do projeto.</p>
      </div>

      <div class="atlas-controls" aria-label="Controles do shader ativo">
        <label>
          Intensidade
          <input class="atlas-range" data-uniform="u_intensity" type="range" min="0" max="1.4" step="0.01" value="0.72">
        </label>
        <label>
          Respiração do vertex
          <input class="atlas-range" data-uniform="u_breath" type="range" min="0" max="1.5" step="0.01" value="0.65">
        </label>
        <div class="legacy-controls" aria-label="Controles legacy">
          <p>Legacy controller</p>
          <label>
            <span data-legacy-label="u_legacy_a">Legacy A</span>
            <input class="atlas-range legacy-range" data-uniform="u_legacy_a" type="range" min="0" max="1" step="0.01" value="0.5">
          </label>
          <label>
            <span data-legacy-label="u_legacy_b">Legacy B</span>
            <input class="atlas-range legacy-range" data-uniform="u_legacy_b" type="range" min="0" max="1" step="0.01" value="0.5">
          </label>
          <label>
            <span data-legacy-label="u_legacy_c">Legacy C</span>
            <input class="atlas-range legacy-range" data-uniform="u_legacy_c" type="range" min="0" max="1" step="0.01" value="0.5">
          </label>
        </div>
        <div class="camera-controls" aria-label="Presets de camera cinematica">
          <p>Cinematic camera</p>
          <div class="camera-chip-list">
            ${cameraPresets.map((camera, index) => `
              <button class="camera-chip${index === this.activeCameraIndex ? ' is-active' : ''}" data-camera="${index}" type="button">
                <strong>${camera.title}</strong>
                <span>${camera.tag}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="atlas-grid" aria-label="Biblioteca de shaders">
        ${studies.map((study, index) => `
          <button class="atlas-card${index === this.activeIndex ? ' is-active' : ''}" data-index="${index}" type="button">
            <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="card-source">${study.source}</span>
            <strong>${study.title}</strong>
            <em>${study.tag}</em>
          </button>
        `).join('')}
      </div>

      <article class="atlas-note">
        <h2>${studies[this.activeIndex].title}</h2>
        <p>${studies[this.activeIndex].note}</p>
        <small>Mouse move altera o campo; setas esquerda/direita trocam o estudo; [ e ] trocam a camera.</small>
      </article>
    `;

    document.body.appendChild(this.root);
    this.noteTitle = this.root.querySelector('.atlas-note h2');
    this.noteText = this.root.querySelector('.atlas-note p');
    this.cards = Array.from(this.root.querySelectorAll('.atlas-card'));
    this.ranges = Array.from(this.root.querySelectorAll('.atlas-range'));
    this.legacyControls = this.root.querySelector('.legacy-controls');
    this.legacyRanges = Array.from(this.root.querySelectorAll('.legacy-range'));
    this.legacyLabels = Array.from(this.root.querySelectorAll('[data-legacy-label]'));
    this.cameraButtons = Array.from(this.root.querySelectorAll('.camera-chip'));
    this.syncLegacyControls(studies[this.activeIndex]);
  }

  bindEvents() {
    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        this.setStudy(Number(card.dataset.index));
      });
    });

    this.ranges.forEach((range) => {
      range.addEventListener('input', () => {
        const uniform = range.dataset.uniform;
        this.material.uniforms[uniform].value = Number(range.value);
      });
    });

    this.cameraButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setCameraPreset(Number(button.dataset.camera));
      });
    });

    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.clientX / window.innerWidth;
      this.mouse.y = 1 - event.clientY / window.innerHeight;
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.setStudy((this.activeIndex + 1) % studies.length);
      }

      if (event.key === 'ArrowLeft') {
        this.setStudy(this.activeIndex === 0 ? studies.length - 1 : this.activeIndex - 1);
      }

      if (event.key === ']') {
        this.setCameraPreset((this.activeCameraIndex + 1) % cameraPresets.length);
      }

      if (event.key === '[') {
        this.setCameraPreset(
          this.activeCameraIndex === 0 ? cameraPresets.length - 1 : this.activeCameraIndex - 1,
        );
      }
    });

    window.addEventListener('resize', this.resize.bind(this));
  }

  setStudy(index) {
    this.activeIndex = index;
    const study = studies[index];

    this.material.fragmentShader = study.fragment;
    this.applyStudyUniforms(study);
    this.material.needsUpdate = true;

    this.cards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === index);
    });

    this.noteTitle.textContent = study.title;
    this.noteText.textContent = study.note;
    this.syncLegacyControls(study);
  }

  setCameraPreset(index) {
    this.activeCameraIndex = index;
    const preset = cameraPresets[index];
    const target = new THREE.Vector3(...preset.target);

    this.camera.fov = preset.fov;
    this.camera.position.set(...preset.position);
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();

    if (this.mesh) {
      this.mesh.rotation.set(...preset.meshRotation);
      this.mesh.scale.set(preset.meshScale, preset.meshScale, 1);
    }

    if (this.cameraButtons) {
      this.cameraButtons.forEach((button, buttonIndex) => {
        button.classList.toggle('is-active', buttonIndex === index);
      });
    }
  }

  applyStudyUniforms(study) {
    this.material.uniforms.u_texture.value = this.textures[study.texture] || this.textures[perro];
    this.material.uniforms.u_texture_alt.value = this.textures[study.textureAlt] || this.textures[bEnd];
    this.material.uniforms.u_displacement.value = this.textures[study.displacement] || this.textures[displacement];

    (study.legacyControls || []).forEach((control) => {
      this.material.uniforms[control.uniform].value = control.value;
    });
  }

  syncLegacyControls(study) {
    const controls = study.legacyControls || [];
    const enabled = controls.length > 0;

    this.legacyControls.classList.toggle('is-visible', enabled);

    this.legacyRanges.forEach((range) => {
      const control = controls.find((item) => item.uniform === range.dataset.uniform);
      range.disabled = !control;

      if (control) {
        range.value = control.value;
      }
    });

    this.legacyLabels.forEach((label) => {
      const control = controls.find((item) => item.uniform === label.dataset.legacyLabel);
      label.textContent = control ? control.label : label.dataset.legacyLabel;
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.u_resolution.value.set(this.width, this.height);
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.016;
    this.material.uniforms.u_time.value = this.time;
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

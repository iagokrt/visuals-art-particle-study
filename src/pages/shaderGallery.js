import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import '../styles/global.scss';

import vertex from '../shader/gallery/studyVertex.glsl';
import ashPlain from '../shader/gallery/ashPlain.frag';
import vuGhost from '../shader/gallery/vuGhost.frag';
import furColossus from '../shader/gallery/furColossus.frag';
import forbiddenBloom from '../shader/gallery/forbiddenBloom.frag';
import stormSilhouette from '../shader/gallery/stormSilhouette.frag';
import memoryLake from '../shader/gallery/memoryLake.frag';
import heatMirage from '../shader/gallery/heatMirage.frag';
import silkRibbons from '../shader/gallery/silkRibbons.frag';
import truchetPlates from '../shader/gallery/truchetPlates.frag';
import perlinDrift from '../shader/gallery/perlinDrift.frag';
import cellularRelic from '../shader/gallery/cellularRelic.frag';
import botanicalSection from '../shader/gallery/botanicalSection.frag';
import fbmTerrain from '../shader/gallery/fbmTerrain.frag';
import atmosphereSky from '../shader/gallery/atmosphereSky.frag';
import domainWarpMarble from '../shader/gallery/domainWarpMarble.frag';
import moltenLava from '../shader/gallery/moltenLava.frag';
import neonRainStreet from '../shader/gallery/neonRainStreet.frag';
import pyramidDusk from '../shader/gallery/pyramidDusk.frag';
import statueGarden from '../shader/gallery/statueGarden.frag';
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
    id: 'silk',
    title: 'Silk Ribbons',
    tag: 'transparent cloth / ink smoke / flow field',
    source: 'new study',
    fragment: silkRibbons,
    note: 'Faixas translúcidas como seda, fumaça ou tinta suspensa. Estudo bom para magia, interface viva, partículas elegantes e transições etéreas.',
  },
  {
    id: 'truchet',
    title: 'Truchet Plates',
    tag: 'ornament / procedural tile book',
    source: 'new study',
    fragment: truchetPlates,
    note: 'Azulejos Truchet com cara de prancha geométrica antiga: arcos, grade, variação por hash e papel envelhecido. Bom para arquitetura procedural, UI ornamental e padrões de mundo.',
  },
  {
    id: 'perlin',
    title: 'Perlin Drift',
    tag: 'gradient noise / clouds / terrain',
    source: 'new study',
    fragment: perlinDrift,
    note: 'Ruído gradiente em camadas: nuvem, névoa, relevo e fluxo contínuo. É o estudo-base para materiais orgânicos que não devem parecer quadriculados.',
  },
  {
    id: 'cellular',
    title: 'Cellular Relic',
    tag: 'voronoi cells / cracks / mineral skin',
    source: 'new study',
    fragment: cellularRelic,
    note: 'Ruído celular/Voronoi para placas, poros, rachaduras e superfície mineral. Ótimo para pedra, casco, ruína alienígena e mapas de desgaste.',
  },
  {
    id: 'botanical',
    title: 'Botanical Section',
    tag: 'plant anatomy / vessel cells / scientific plate',
    source: 'new study',
    fragment: botanicalSection,
    note: 'Corte botânico procedural: vasos grandes, microcélulas, anéis de tecido e traço de prancha científica. Bom para estudar anatomia, ruínas orgânicas e mapas celulares.',
  },
  {
    id: 'fbm',
    title: 'FBM Terrain',
    tag: 'fractal brownian motion / octaves / domain warp',
    source: 'new study',
    fragment: fbmTerrain,
    note: 'Fractal Brownian Motion em camadas: várias oitavas de ruído somadas para criar montanha, nuvem e erosão. Um dos blocos fundamentais de mundos procedurais.',
  },
  {
    id: 'atmosphere-sky',
    title: 'Atmosphere Sky',
    tag: 'sky shader / sun / aerial haze',
    source: 'three-inspired',
    fragment: atmosphereSky,
    note: 'Estudo inspirado no exemplo Sky do Three: sol controlado pelo mouse, dispersão atmosférica estilizada, nuvens lentas e brilho de horizonte para cenas abertas.',
  },
  {
    id: 'domain-warp',
    title: 'Domain Warp Marble',
    tag: 'fbm inside fbm / turbulent coordinates',
    source: 'new study',
    fragment: domainWarpMarble,
    note: 'Domain warping: um FBM desloca as coordenadas de outro FBM, criando dobras, redemoinhos e mármore nebuloso. É o sonho dentro do sonho dos ruídos procedurais.',
  },
  {
    id: 'molten-lava',
    title: 'Molten Lava',
    tag: 'lava shader / emissive flow / cracked crust',
    source: 'three-inspired',
    fragment: moltenLava,
    note: 'Estudo inspirado no clássico Lava do Three: fluxo quente, crosta escura rachada, células emissivas e fumaça sutil, mas feito proceduralmente sem texturas externas.',
  },
  {
    id: 'neon-rain',
    title: 'Neon Rain Street',
    tag: 'night city / rain / wet lens',
    source: 'new study',
    fragment: neonRainStreet,
    note: 'Rua noturna chuvosa com reflexos de neon, faixa de luz e sensação fotográfica. Estudo para cidade, clima urbano, lente molhada e contraste cinematográfico.',
  },
  {
    id: 'pyramid-dusk',
    title: 'Pyramid Dusk',
    tag: 'desert / monuments / historical scale',
    source: 'new study',
    fragment: pyramidDusk,
    note: 'Deserto ao entardecer com pirâmides, sol baixo, poeira e escala histórica. Um estudo de composição para monumento, distância e silêncio.',
  },
  {
    id: 'statue-garden',
    title: 'Statue Garden',
    tag: 'sculpture / nature / museum light',
    source: 'new study',
    fragment: statueGarden,
    note: 'Escultura de pedra tomada por musgo e luz de jardim/museu. Estudo de matéria, história, natureza retomando forma humana e fotografia calma.',
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

const effectGroups = [
  {
    id: 'atmosphere',
    title: 'Atmosfera e Paisagem',
    tag: 'sky, horizonte, clima, escala',
    studyIds: ['ash', 'storm', 'lake', 'mirage', 'fbm', 'atmosphere-sky', 'pyramid-dusk'],
  },
  {
    id: 'matter',
    title: 'Materia Organica e Mineral',
    tag: 'ruido, celulas, pele, relevo',
    studyIds: ['fur', 'cellular', 'botanical', 'domain-warp', 'statue-garden'],
  },
  {
    id: 'patterns',
    title: '2D, Padroes e Campos',
    tag: 'tiles, scans, flow fields',
    studyIds: ['vu', 'silk', 'truchet', 'perlin'],
  },
  {
    id: 'emissive',
    title: 'Luz Emissiva e Pos',
    tag: 'bloom, neon, lava, aura',
    studyIds: ['bloom', 'molten-lava', 'neon-rain'],
  },
  {
    id: 'image',
    title: 'Imagem e Legacy',
    tag: 'textura, displacement, frames',
    studyIds: ['legacy-displacement', 'legacy-particles', 'legacy-sculpture'],
  },
];

const studiesById = studies.reduce((result, study, index) => {
  result[study.id] = { study, index };
  return result;
}, {});

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
    this.isSmallViewport = window.matchMedia('(max-width: 760px)').matches;
    this.time = 0;
    this.activeIndex = 0;
    this.activeCameraIndex = 0;
    this.isCameraUnlocked = false;
    this.isMenuCollapsed = this.isSmallViewport;
    this.mouse = new THREE.Vector2(0.5, 0.5);
    this.isPlaying = true;
    this.textureLoader = new THREE.TextureLoader();
    this.textures = {};

    this.createScene();
    this.createStats();
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

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSmallViewport,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.updatePixelRatio();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x05060a, 1);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.55;
    this.controls.zoomSpeed = 0.8;
    this.controls.panSpeed = 0.55;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 6.0;
    this.controls.enablePan = !this.isSmallViewport;
  }

  createStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.classList.add('atlas-stats');
    this.stats.dom.style.top = 'auto';
    this.stats.dom.style.right = '12px';
    this.stats.dom.style.bottom = '12px';
    this.stats.dom.style.left = 'auto';
    this.stats.dom.style.zIndex = '60';
    document.body.appendChild(this.stats.dom);
  }

  createStudies() {
    const widthSegments = this.isSmallViewport ? 96 : 160;
    const heightSegments = this.isSmallViewport ? 68 : 120;
    this.geometry = new THREE.PlaneBufferGeometry(3.4, 2.05, widthSegments, heightSegments);

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
    const renderStudyCard = (study, index) => `
      <button class="atlas-card${index === this.activeIndex ? ' is-active' : ''}" data-index="${index}" type="button">
        <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="card-source">${study.source}</span>
        <strong>${study.title}</strong>
        <em>${study.tag}</em>
      </button>
    `;

    this.root = document.createElement('section');
    this.root.className = `shader-atlas${this.isMenuCollapsed ? ' is-menu-collapsed' : ''}`;
    this.root.innerHTML = `
      <button class="atlas-menu-toggle" type="button" aria-expanded="${String(!this.isMenuCollapsed)}" aria-label="${this.isMenuCollapsed ? 'Abrir menu' : 'Recolher menu'}">
        <span class="toggle-open">Fechar menu</span>
        <span class="toggle-closed">Abrir menu</span>
      </button>

      <div class="atlas-current-dock">
        <button class="atlas-step atlas-step-prev" data-step="-1" type="button" aria-label="Estudo anterior">
          <span aria-hidden="true">‹</span>
        </button>

        <button class="atlas-current-card" type="button" aria-label="Abrir menu do estudo atual">
          <span class="card-number">${String(this.activeIndex + 1).padStart(2, '0')}</span>
          <span class="card-source">${studies[this.activeIndex].source}</span>
          <strong>${studies[this.activeIndex].title}</strong>
          <em>${studies[this.activeIndex].tag}</em>
        </button>

        <button class="atlas-step atlas-step-next" data-step="1" type="button" aria-label="Proximo estudo">
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <aside class="atlas-sidebar" aria-label="Menu de estudos shader">
        <div class="atlas-hero">
          <p class="eyebrow">shader field notes</p>
          <h1>Arqueologia visual para um jogo design-first</h1>
          <p class="lead">Biblioteca de fragment shaders por familia de efeito.</p>
        </div>

        <details class="atlas-controls" aria-label="Controles do shader ativo"${this.isSmallViewport ? '' : ' open'}>
          <summary>
            <span>Controles e camera</span>
            <b>shader setup</b>
          </summary>
          <div class="atlas-controls-body">
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
              <label class="camera-toggle">
                <input class="camera-unlock" type="checkbox">
                <span>Liberar camera manual</span>
              </label>
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
        </details>

        <div class="atlas-browser" aria-label="Biblioteca de shaders">
          <div class="atlas-group-tabs" aria-label="Familias de efeito">
            ${effectGroups.map((group) => {
              const groupStudies = group.studyIds
                .map((id) => studiesById[id])
                .filter(Boolean);
              const isActiveGroup = groupStudies.some(({ index }) => index === this.activeIndex);

              return `
                <button class="atlas-group-tab${isActiveGroup ? ' is-active' : ''}" data-group="${group.id}" type="button" aria-pressed="${String(isActiveGroup)}">
                  <i>${String.fromCharCode(65 + effectGroups.indexOf(group))}</i>
                  <span>
                    <strong>${group.title}</strong>
                    <em>${group.tag}</em>
                  </span>
                  <b>${String(groupStudies.length).padStart(2, '0')} itens</b>
                </button>
              `;
            }).join('')}
          </div>

          <div class="atlas-study-panels">
            ${effectGroups.map((group) => {
              const groupStudies = group.studyIds
                .map((id) => studiesById[id])
                .filter(Boolean);
              const isActiveGroup = groupStudies.some(({ index }) => index === this.activeIndex);

              return `
                <div class="atlas-study-panel${isActiveGroup ? ' is-active' : ''}" data-group="${group.id}">
                  ${groupStudies.map(({ study, index }) => renderStudyCard(study, index)).join('')}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <article class="atlas-note">
          <h2>${studies[this.activeIndex].title}</h2>
          <p>${studies[this.activeIndex].note}</p>
          <small>Mouse move altera o campo; setas esquerda/direita trocam o estudo; [ e ] trocam a camera.</small>
        </article>
      </aside>
    `;

    document.body.appendChild(this.root);
    document.body.classList.toggle('is-atlas-menu-open', !this.isMenuCollapsed);
    this.noteTitle = this.root.querySelector('.atlas-note h2');
    this.noteText = this.root.querySelector('.atlas-note p');
    this.cards = Array.from(this.root.querySelectorAll('.atlas-card'));
    this.groupTabs = Array.from(this.root.querySelectorAll('.atlas-group-tab'));
    this.studyPanels = Array.from(this.root.querySelectorAll('.atlas-study-panel'));
    this.ranges = Array.from(this.root.querySelectorAll('.atlas-range'));
    this.legacyControls = this.root.querySelector('.legacy-controls');
    this.legacyRanges = Array.from(this.root.querySelectorAll('.legacy-range'));
    this.legacyLabels = Array.from(this.root.querySelectorAll('[data-legacy-label]'));
    this.cameraButtons = Array.from(this.root.querySelectorAll('.camera-chip'));
    this.cameraUnlock = this.root.querySelector('.camera-unlock');
    this.menuToggle = this.root.querySelector('.atlas-menu-toggle');
    this.currentCard = this.root.querySelector('.atlas-current-card');
    this.stepButtons = Array.from(this.root.querySelectorAll('.atlas-step'));
    this.syncLegacyControls(studies[this.activeIndex]);
  }

  bindEvents() {
    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        this.setStudy(Number(card.dataset.index));
      });
    });

    this.stepButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.stepStudy(Number(button.dataset.step));
      });
    });

    this.groupTabs.forEach((button) => {
      button.addEventListener('click', () => {
        const group = effectGroups.find((item) => item.id === button.dataset.group);
        const isCurrentGroup = group && group.studyIds.includes(studies[this.activeIndex].id);

        if (!group) return;

        if (isCurrentGroup) {
          this.setActiveGroup(group.id);
          return;
        }

        this.setStudy(studiesById[group.studyIds[0]].index);
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

    this.cameraUnlock.addEventListener('change', () => {
      this.setCameraUnlocked(this.cameraUnlock.checked);
    });

    this.menuToggle.addEventListener('click', () => {
      this.setMenuCollapsed(!this.isMenuCollapsed);
    });

    this.currentCard.addEventListener('click', () => {
      this.setMenuCollapsed(false);
    });

    window.addEventListener('pointermove', this.updatePointer.bind(this), { passive: true });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.stepStudy(1);
      }

      if (event.key === 'ArrowLeft') {
        this.stepStudy(-1);
      }

      if (event.key === ']') {
        this.setCameraPreset((this.activeCameraIndex + 1) % cameraPresets.length);
      }

      if (event.key === '[') {
        this.setCameraPreset(
          this.activeCameraIndex === 0 ? cameraPresets.length - 1 : this.activeCameraIndex - 1,
        );
      }

      if (event.key.toLowerCase() === 'm') {
        this.setMenuCollapsed(!this.isMenuCollapsed);
      }
    });

    window.addEventListener('resize', this.resize.bind(this));
  }

  updatePointer(event) {
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = 1 - event.clientY / window.innerHeight;
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
    this.currentCard.querySelector('.card-number').textContent = String(index + 1).padStart(2, '0');
    this.currentCard.querySelector('.card-source').textContent = study.source;
    this.currentCard.querySelector('strong').textContent = study.title;
    this.currentCard.querySelector('em').textContent = study.tag;
    this.syncLegacyControls(study);
    this.openActiveGroup(index);
  }

  stepStudy(direction) {
    const nextIndex = (this.activeIndex + direction + studies.length) % studies.length;
    this.setStudy(nextIndex);
  }

  openActiveGroup(index) {
    const study = studies[index];
    const activeGroup = effectGroups.find((group) => group.studyIds.includes(study.id));

    if (!activeGroup) return;

    this.setActiveGroup(activeGroup.id);
  }

  setActiveGroup(groupId) {
    if (!this.groupTabs || !this.studyPanels) return;

    this.groupTabs.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.group === groupId);
      button.setAttribute('aria-pressed', String(button.dataset.group === groupId));
    });

    this.studyPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.group === groupId);
    });
  }

  setCameraPreset(index) {
    this.activeCameraIndex = index;
    const preset = cameraPresets[index];
    const target = new THREE.Vector3(...preset.target);

    this.camera.fov = preset.fov;
    this.camera.position.set(...preset.position);
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(target);
    this.controls.update();

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

  setCameraUnlocked(isUnlocked) {
    this.isCameraUnlocked = isUnlocked;
    this.controls.enabled = isUnlocked;
    this.root.classList.toggle('is-camera-unlocked', isUnlocked);
  }

  setMenuCollapsed(isCollapsed) {
    this.isMenuCollapsed = isCollapsed;
    this.root.classList.toggle('is-menu-collapsed', isCollapsed);
    document.body.classList.toggle('is-atlas-menu-open', !isCollapsed);
    this.menuToggle.setAttribute('aria-expanded', String(!isCollapsed));
    this.menuToggle.setAttribute('aria-label', isCollapsed ? 'Abrir menu' : 'Recolher menu');
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
    this.isSmallViewport = window.matchMedia('(max-width: 760px)').matches;
    this.updatePixelRatio();
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.u_resolution.value.set(this.width, this.height);
  }

  updatePixelRatio() {
    const maxPixelRatio = this.isSmallViewport ? 1.35 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  }

  render() {
    if (!this.isPlaying) return;

    this.stats.begin();
    this.time += 0.016;
    this.material.uniforms.u_time.value = this.time;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    requestAnimationFrame(this.render.bind(this));
  }
}

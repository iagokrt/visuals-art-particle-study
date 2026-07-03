import ShaderGallery from './pages/shaderGallery.js';

import './styles/global.scss';

document.addEventListener('DOMContentLoaded', () => {
  new ShaderGallery({
    dom: document.getElementById('webgl'),
  });
});

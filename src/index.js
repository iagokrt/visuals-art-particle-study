import Particled from './pages/particled.js';
import Displacement from './pages/displacement.js';
import Sculpture from './pages/sculpture.js';

javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})() // stats from https://github.com/mrdoob/stats.js/

// import * as dat from 'dat.gui';
// import gsap from 'gsap';

import './styles/global.scss';

/**
 * Menu Principal
 */
class Menu {
  constructor() {
    this.links = document.querySelectorAll('.menu .list-items button');
    this.attachEventListeners();
    this.currentExample = null; // Armazena a instância atual
  }

  attachEventListeners() {
    this.links.forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  }

  handleLinkClick(event) {
    const clickedButton = event.currentTarget;
    const exampleNumber = clickedButton.classList[0].split('-')[1];
    console.log(`Link ${exampleNumber} clicado`);
    this.changeExample(exampleNumber);
  }

  changeExample(exampleNumber) {
    // Verificar se há uma instância atual e remover, se houver
    if (this.currentExample) {
      console.log('remover instância atual existente antes de adicionar uma nova')
      // this.currentExample.dispose();
      // this.currentExample = null;
    }

    // Implemente o que você precisa fazer com base no número do exemplo
    // Por exemplo, você pode instanciar diferentes classes com base no número do exemplo.
    switch (exampleNumber) {
      case '01':
        this.currentExample = new Displacement({
          dom: document.getElementById('webgl'),
        });
        
        break;
      case '02':
        this.currentExample = new Particled({
          dom: document.getElementById('webgl'),
        });
      case '03':
        this.currentExample = new Sculpture({
          dom: document.getElementById('webgl'),
        });
        break;
      default:
        console.log('Exemplo não encontrado');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // new Menu();

  // new Displacement({
  //   dom: document.getElementById('webgl'),
  // });
  // new Particled({
  //   dom: document.getElementById('webgl'),
  // });
  new Sculpture({
    dom: document.getElementById('webgl'),
  });

});
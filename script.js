/**
 * Interações da Landing Page - Academia Exemplo (Tema Dark & Orange)
 * Mantido simples e performático (Vanilla JS).
 */
document.addEventListener('DOMContentLoaded', () => {
  window.__lpIniciado = true;

  // 1. Menu Mobile
  const nav = document.querySelector('.nav');
  const botaoMenu = document.querySelector('.nav__botao');
  const listaMenu = document.querySelector('#menu-principal');

  if (botaoMenu && listaMenu) {
    botaoMenu.addEventListener('click', () => {
      const aberto = nav.classList.toggle('nav--aberto');
      botaoMenu.setAttribute('aria-expanded', aberto);
    });

    listaMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('nav--aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Header Sticky
  const topo = document.querySelector('.topo');
  if (topo) {
    window.addEventListener('scroll', () => {
      topo.classList.toggle('topo--rolado', window.scrollY > 10);
    }, { passive: true });
  }

  // 3. Scroll Reveal (Animação de entrada)
  const elementos = document.querySelectorAll('[data-revelar]');
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduzirMovimento) {
    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elementos.forEach(el => observer.observe(el));
  } else {
    elementos.forEach(el => el.classList.add('visivel'));
  }

  // 4. Formulário de Contato (Redireciona para WhatsApp)
  const form = document.querySelector('form[data-whatsapp]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dados = new FormData(form);
      const nome = dados.get('nome');
      const contato = dados.get('contato');
      const mensagem = dados.get('mensagem') || 'Gostaria de saber mais sobre os planos.';
      
      const texto = `Olá! Meu nome é ${nome}.\nMeu contato: ${contato}\nObjetivo: ${mensagem}\n\nVim pelo site e quero agendar minha aula grátis!`;
      const url = `${form.dataset.whatsapp}?text=${encodeURIComponent(texto)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // 5. Contadores (Anima os números da prova social)
  const contadores = document.querySelectorAll('[data-contador]');
  if (contadores.length && !reduzirMovimento && 'IntersectionObserver' in window) {
    const animar = (el) => {
      const textoOriginal = el.textContent.trim();
      const match = textoOriginal.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!match) return;

      const prefixo = match[1];
      const numeroStr = match[2];
      const sufixo = match[3];
      
      if (sufixo || prefixo === '+') {
         const alvo = parseFloat(numeroStr);
         const duracao = 1500;
         const inicio = performance.now();

         const passo = (agora) => {
           const progresso = Math.min((agora - inicio) / duracao, 1);
           const valorAtual = Math.floor(alvo * (1 - Math.pow(1 - progresso, 3)));
           el.textContent = prefixo + valorAtual + sufixo;
           if (progresso < 1) requestAnimationFrame(passo);
         };
         requestAnimationFrame(passo);
      }
    };

    const obsContador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          animar(entrada.target);
          obsContador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.5 });

    contadores.forEach(c => obsContador.observe(c));
  }
});
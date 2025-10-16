/*
  Fichier: app.js
  Rôle: Initialisation Mermaid, liaison des clics, gestion erreurs et amélioration UX (ancre active).
  Dépendances: Mermaid (CDN).
*/

(function init() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    if (window.mermaid && typeof window.mermaid.initialize === 'function') {
      window.mermaid.initialize({ startOnLoad: true, securityLevel: 'loose', theme: 'default' });
    }
  } catch (err) {
    console.error('Erreur initialisation Mermaid:', err);
    const diag = document.getElementById('flowchart');
    if (diag) diag.setAttribute('data-error', 'Mermaid non disponible');
  }

  // Amélioration: sur clic d'un lien ancre, focus la section et mettre à jour l'URL sans saut agressif
  function attachAnchorBehavior() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const section = document.querySelector(hash);
      if (!section) return;
      e.preventDefault();
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  }

  // Sur clic dans le SVG mermaid (liens générés par "click"), capturer et appliquer smooth scroll
  function attachMermaidClickDelegation() {
    const diagramHost = document.getElementById('flowchart');
    if (!diagramHost) return;
    diagramHost.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const section = document.querySelector(href);
      if (!section) return;
      e.preventDefault();
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  }

  // Sur surlignage de la section active selon le hash
  function highlightActiveSection() {
    const hash = location.hash;
    document.querySelectorAll('.content-block').forEach((el) => {
      el.classList.toggle('active', '#' + el.id === hash);
    });
  }

  attachAnchorBehavior();
  attachMermaidClickDelegation();
  highlightActiveSection();
  window.addEventListener('hashchange', highlightActiveSection);
})();



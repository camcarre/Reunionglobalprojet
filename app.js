/*
  Fichier: app.js
  Rôle: Navigation slides, animations, initialisation Mermaid, gestion clavier
  Qualité: Code professionnel avec gestion erreurs et accessibilité
*/

(function() {
  'use strict';

  // État de la présentation
  let currentSlide = 1;
  const totalSlides = 12;

  // Éléments DOM
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');

  // Initialisation Mermaid
  function initMermaid() {
    try {
      if (window.mermaid && typeof window.mermaid.initialize === 'function') {
        window.mermaid.initialize({
          startOnLoad: true,
          theme: 'base',
          themeVariables: {
            primaryColor: '#fdf2e9',
            primaryTextColor: '#000000',
            primaryBorderColor: '#f59e0b',
            secondaryColor: '#0ea5e9',
            secondaryTextColor: '#ffffff',
            secondaryBorderColor: '#0284c7',
            tertiaryColor: '#10b981',
            tertiaryTextColor: '#ffffff',
            tertiaryBorderColor: '#059669',
            lineColor: '#475569',
            textColor: '#f1f5f9',
            mainBkg: '#1e293b',
            nodeBorder: '#475569',
            clusterBkg: '#1e293b',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          }
        });
        console.log('✓ Mermaid initialisé avec succès');
      }
    } catch (err) {
      console.error('✗ Erreur initialisation Mermaid:', err);
      const diagram = document.getElementById('flowchart');
      if (diagram) {
        diagram.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 40px;">Erreur de chargement du diagramme. Veuillez rafraîchir la page.</p>';
      }
    }
  }

  // Navigation vers une slide
  function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;

    // Retirer classe active de la slide actuelle
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev');
      if (parseInt(slide.dataset.slide) < slideNumber) {
        slide.classList.add('prev');
      }
    });

    // Activer la nouvelle slide
    const targetSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
    if (targetSlide) {
      targetSlide.classList.add('active');
      currentSlide = slideNumber;
      
      // Mettre à jour UI
      updateUI();
      
      // Focus pour accessibilité
      targetSlide.setAttribute('tabindex', '-1');
      targetSlide.focus({ preventScroll: true });
      
      // Scroll smooth pour les longs contenus
      targetSlide.scrollTop = 0;
    }
  }

  // Mettre à jour l'interface
  function updateUI() {
    // Barre de progression
    const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    progressFill.style.width = `${progress}%`;

    // Compteur
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

    // Boutons navigation
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
  }

  // Navigation précédente
  function previousSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }

  // Navigation suivante
  function nextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  }

  // Gestion clavier
  function handleKeyboard(e) {
    switch(e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        previousSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
      case 'Escape':
        e.preventDefault();
        goToSlide(1);
        break;
    }
  }

  // Gestion tactile (swipe mobile)
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left → next
        nextSlide();
      } else {
        // Swipe right → prev
        previousSlide();
      }
    }
  }

  // Gestion molette souris (optionnel, désactivable)
  let wheelTimeout;
  function handleWheel(e) {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        nextSlide();
      } else if (e.deltaY < 0) {
        previousSlide();
      }
    }, 100);
  }

  // Event listeners
  function attachEventListeners() {
    // Boutons
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Clavier
    document.addEventListener('keydown', handleKeyboard);

    // Tactile
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Molette (commenté par défaut pour éviter navigation accidentelle)
    // document.addEventListener('wheel', handleWheel, { passive: true });
  }

  // Initialisation
  function init() {
    console.log('🚀 Initialisation de la présentation Axima Marine');
    
    // Mermaid
    initMermaid();
    
    // UI initiale
    updateUI();
    
    // Events
    attachEventListeners();
    
    // Précharger les polices et images
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('✓ Polices chargées');
      });
    }

    console.log(`✓ Présentation prête: ${totalSlides} slides`);
  }

  // Démarrage au chargement DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Mode présentation plein écran (F11 ou bouton)
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen non disponible:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Export pour usage externe si nécessaire
  window.PresentationAPI = {
    goToSlide,
    nextSlide,
    previousSlide,
    toggleFullscreen,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
  };

})();

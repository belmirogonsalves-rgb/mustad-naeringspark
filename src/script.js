/* ==========================================================================
   MUSTAD NÆRINGSPARK — Shared JavaScript
   script.js — All shared behaviours across every page
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. NAV — Scroll solidify + active link detection
   ========================================================================== */

(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Solidify nav on scroll
  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Run once on load (handles page refresh mid-scroll)

  // Active link — match current page filename
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = nav.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile === currentPath) {
      link.classList.add('active');
    }
  });
})();


/* ==========================================================================
   2. MOBILE MENU — Hamburger toggle + drawer
   ========================================================================== */

(function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const drawer    = document.querySelector('.nav__drawer');
  if (!hamburger || !drawer) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on drawer link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    const nav = document.querySelector('.nav');
    if (isOpen && nav && !nav.contains(e.target)) closeMenu();
  });
})();


/* ==========================================================================
   3. SCROLL ANIMATIONS — Intersection Observer
   ========================================================================== */

(function initScrollAnimations() {
  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Make everything visible immediately
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Fire once
      }
    });
  }, observerOptions);

  const animatedEls = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  animatedEls.forEach(el => observer.observe(el));
})();


/* ==========================================================================
   4. HERO — Ken Burns image load trigger
   ========================================================================== */

(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Add loaded class after a tick so CSS transition fires
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('loaded'), 100);
  });
})();


/* ==========================================================================
   5. LIGHTBOX — Gallery image overlay
   ========================================================================== */

(function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg  = lightbox.querySelector('.lightbox__img');
  const closeBtn     = lightbox.querySelector('.lightbox__close');
  const galleryItems = document.querySelectorAll('.gallery__item[data-src]');

  if (!galleryItems.length) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.src, item.dataset.alt || '');
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item.dataset.src, item.dataset.alt || '');
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Close on overlay click (not image click)
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();


/* ==========================================================================
   6. FILTER SYSTEM — Ledige Lokaler listings
   Exported on window.MNP.Filters so ledige-lokaler.html can call init()
   and inspect state externally if needed.
   ========================================================================== */

window.MNP = window.MNP || {};

window.MNP.Filters = {

  // ── Pure helpers (exported so tests / other pages can use them) ──────────

  /**
   * Map a raw kvm string to one of the four dropdown bucket values.
   * Matches the <option value="..."> in the filter bar.
   */
  getSizeCategory(kvm) {
    const n = parseInt(kvm, 10);
    if (isNaN(n)) return 'unknown';
    if (n < 100)             return 'under-100';
    if (n >= 100 && n < 300) return '100-300';
    if (n >= 300 && n < 600) return '300-600';
    return '600-plus';
  },

  /**
   * Map a date string / keyword to one of the availability bucket values.
   * Accepts ISO date strings ("2026-07-01"), Norwegian keywords
   * ("omgående", "nå"), and falls back to "now" on parse failure.
   */
  getAvailableCategory(dateStr) {
    const s = (dateStr || '').toLowerCase().trim();
    if (!s || s === 'omgående' || s === 'nå' || s === 'now') return 'now';
    const today = new Date();
    const avail = new Date(dateStr);
    if (isNaN(avail.getTime())) return 'now';
    const diffMonths =
      (avail.getFullYear() - today.getFullYear()) * 12 +
      (avail.getMonth() - today.getMonth());
    if (diffMonths <= 0) return 'now';
    if (diffMonths <= 3) return '3-months';
    if (diffMonths <= 6) return '6-months';
    return 'later';
  },

  // ── State ─────────────────────────────────────────────────────────────────

  _state: { building: 'all', size: 'all', available: 'all' },

  /** Read-only snapshot of current filter state. */
  getState() {
    return { ...this._state };
  },

  // ── Core filter function (exported — call anytime to re-filter) ──────────

  /**
   * Re-evaluates every .listing-card against current filter state.
   * Safe to call before DOM is ready (returns 0 if no cards found).
   * @returns {number} count of visible listings
   */
  applyFilters() {
    const listings = document.querySelectorAll(
      '.listing-card[data-building][data-size][data-available]'
    );
    const countEl  = document.querySelector('.filter-count');
    const { building, size, available } = this._state;
    let visible = 0;

    listings.forEach(card => {
      const cardBuilding  = card.dataset.building  || '';
      const cardKvm       = card.dataset.size       || '0';
      const cardAvailable = card.dataset.available  || 'nå';

      const matchBuilding  = building  === 'all' || cardBuilding === building;
      const matchSize      = size      === 'all' || this.getSizeCategory(cardKvm) === size;
      const matchAvailable = available === 'all' ||
                             this.getAvailableCategory(cardAvailable) === available;

      const show = matchBuilding && matchSize && matchAvailable;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (countEl) {
      const total = listings.length;
      countEl.textContent = visible === total
        ? `Viser alle ${visible} lokaler`
        : `Viser ${visible} av ${total} lokaler`;
    }

    return visible;
  },

  // ── Wiring — call once when the filter bar HTML is in the DOM ─────────────

  /**
   * Attaches change listeners to the three <select> elements in .filter-bar
   * and runs an initial filter pass.
   * Safe to call on pages without a filter bar (no-ops silently).
   */
  init() {
    const filterBar       = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const buildingSelect  = document.getElementById('filter-building');
    const sizeSelect      = document.getElementById('filter-size');
    const availableSelect = document.getElementById('filter-available');

    const onChange = () => {
      this._state.building  = buildingSelect?.value  ?? 'all';
      this._state.size      = sizeSelect?.value      ?? 'all';
      this._state.available = availableSelect?.value ?? 'all';
      this.applyFilters();
    };

    buildingSelect ?.addEventListener('change', onChange);
    sizeSelect     ?.addEventListener('change', onChange);
    availableSelect?.addEventListener('change', onChange);

    this.applyFilters(); // Initial pass on page load
  }
};

// Auto-init when the DOM is ready (no-ops on pages without a filter bar)
document.addEventListener('DOMContentLoaded', () => window.MNP.Filters.init());


/* ==========================================================================
   7. COMPARE PANEL — Select up to 3 spaces for side-by-side comparison
   ========================================================================== */

(function initCompare() {
  const panel    = document.querySelector('.compare-panel');
  const itemsEl  = document.querySelector('.compare-panel__items');
  if (!panel || !itemsEl) return;

  const compareButtons = document.querySelectorAll('[data-compare]');
  if (!compareButtons.length) return;

  const selected = new Map(); // id → { name, building, size, available, amenities }
  const MAX = 3;

  function renderPanel() {
    itemsEl.innerHTML = '';

    selected.forEach((data, id) => {
      const item = document.createElement('div');
      item.className = 'compare-panel__item';
      item.innerHTML = `
        <span class="compare-panel__item-name">${data.name}</span>
        <button class="compare-panel__item-remove" aria-label="Fjern ${data.name}" data-id="${id}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>`;
      itemsEl.appendChild(item);
    });

    // Show/hide panel
    if (selected.size >= 2) {
      panel.classList.add('visible');
    } else {
      panel.classList.remove('visible');
    }

    // Update button states
    compareButtons.forEach(btn => {
      const id = btn.dataset.compare;
      if (selected.has(id)) {
        btn.textContent = 'Valgt';
        btn.classList.add('btn--primary');
        btn.classList.remove('btn--ghost');
      } else {
        btn.textContent = 'Sammenlign';
        btn.classList.remove('btn--primary');
        btn.classList.add('btn--ghost');
        btn.disabled = selected.size >= MAX;
      }
    });

    // Remove button listeners
    itemsEl.querySelectorAll('.compare-panel__item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCompare(btn.dataset.id));
    });
  }

  function addToCompare(id, data) {
    if (selected.has(id)) {
      removeFromCompare(id);
      return;
    }
    if (selected.size >= MAX) return;
    selected.set(id, data);
    renderPanel();
  }

  function removeFromCompare(id) {
    selected.delete(id);
    renderPanel();
  }

  compareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.compare;
      const card = btn.closest('.listing-card');
      const name = card ? (card.querySelector('.listing-card__headline')?.textContent?.trim() || id) : id;
      addToCompare(id, { name });
    });
  });

  // Reset button
  const resetBtn = document.querySelector('.compare-panel__reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selected.clear();
      renderPanel();
    });
  }
})();


/* ==========================================================================
   8. COST ESTIMATOR — Modal with real-time calculation
   ========================================================================== */

(function initEstimator() {
  const trigger = document.querySelector('.estimator-trigger');
  const overlay = document.querySelector('.modal-overlay[data-modal="estimator"]');
  if (!trigger || !overlay) return;

  const modal    = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal__close');
  const input    = overlay.querySelector('#estimator-employees');
  const sqmEl    = overlay.querySelector('#estimator-sqm');
  const costEl   = overlay.querySelector('#estimator-cost');

  const SQM_PER_PERSON  = 12;   // midpoint of 10–15 kvm/person
  const COST_PER_SQM    = 1500; // NOK/kvm/year

  function calculate() {
    const employees = parseInt(input?.value, 10);
    if (!input || isNaN(employees) || employees < 1) {
      if (sqmEl)  sqmEl.textContent  = '—';
      if (costEl) costEl.textContent = '—';
      return;
    }
    const sqm     = Math.ceil(employees * SQM_PER_PERSON);
    const monthly = Math.round((sqm * COST_PER_SQM) / 12);

    if (sqmEl)  sqmEl.textContent  = `ca. ${sqm} kvm`;
    if (costEl) costEl.textContent = `ca. kr ${monthly.toLocaleString('nb-NO')},-`;
  }

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input?.focus(), 50);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  if (input) input.addEventListener('input', calculate);
})();


/* ==========================================================================
   9. PARKING MAP TOOLTIPS
   ========================================================================== */

(function initParkingMap() {
  const mapContainer = document.querySelector('.parking-map');
  if (!mapContainer) return;

  const tooltip = mapContainer.querySelector('.map-tooltip');
  const zones   = mapContainer.querySelectorAll('[data-zone]');
  if (!tooltip || !zones.length) return;

  const zoneData = {
    tenant: {
      title: 'Sone 2 — Leietakere',
      info:  'Gratis for registrerte leietakere. Ikke gyldig for studenter. Treningssenter-brukere: 2 timer gratis.'
    },
    visitor: {
      title: 'Sone 2 — Besøkende',
      info:  'Man–fre 07:00–17:00: kr 15 / time. Øvrig tid: Gratis.'
    },
    paid: {
      title: 'Sone 5 — Alle',
      info:  'Man–fre 07:00–17:00: kr 37 / time. Øvrig tid: Gratis.'
    },
    ev: {
      title: 'EL-ladepunkter',
      info:  'Dedikerte laddeplasser for elbil. Tilgjengelig for alle i parken.'
    }
  };

  let activeZone = null;

  function showTooltip(zone, x, y) {
    const data = zoneData[zone];
    if (!data) return;

    tooltip.querySelector('.map-tooltip__title').textContent = data.title;
    tooltip.querySelector('.map-tooltip__info').textContent  = data.info;

    // Position relative to map container
    const rect     = mapContainer.getBoundingClientRect();
    const relX     = x - rect.left;
    const relY     = y - rect.top;
    const tipW     = 240;
    const tipH     = 80;
    const padding  = 12;

    let left = relX + padding;
    let top  = relY - tipH / 2;

    // Keep inside container
    if (left + tipW > mapContainer.offsetWidth - padding) {
      left = relX - tipW - padding;
    }
    if (top < padding) top = padding;
    if (top + tipH > mapContainer.offsetHeight - padding) {
      top = mapContainer.offsetHeight - tipH - padding;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top  = `${top}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    activeZone = null;
  }

  zones.forEach(zone => {
    const zoneType = zone.dataset.zone;

    zone.addEventListener('mouseenter', e => {
      activeZone = zoneType;
      showTooltip(zoneType, e.clientX, e.clientY);
    });

    zone.addEventListener('mousemove', e => {
      if (activeZone === zoneType) {
        showTooltip(zoneType, e.clientX, e.clientY);
      }
    });

    zone.addEventListener('mouseleave', hideTooltip);

    // Touch support
    zone.addEventListener('click', e => {
      if (activeZone === zoneType) {
        hideTooltip();
      } else {
        activeZone = zoneType;
        const touch = e.touches ? e.touches[0] : e;
        showTooltip(zoneType, touch.clientX, touch.clientY);
      }
    });
  });

  // Hide tooltip on outside click
  document.addEventListener('click', e => {
    if (!mapContainer.contains(e.target)) hideTooltip();
  });
})();


/* ==========================================================================
   10. GENERIC MODAL — Any [data-modal-open] trigger
   ========================================================================== */

(function initGenericModals() {
  // Open: <button data-modal-open="myModal">
  // Close: inside .modal-overlay[data-modal="myModal"] use .modal__close

  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    const modalId = trigger.dataset.modalOpen;
    const overlay = document.querySelector(`.modal-overlay[data-modal="${modalId}"]`);
    if (!overlay) return;

    trigger.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeBtn = overlay.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Global Escape handler for any open overlay
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.open').forEach(overlay => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ==========================================================================
   11. SMOOTH SCROLL — Internal anchor links + exported MNP.smoothScrollTo
   ========================================================================== */

// ── Exported utility ────────────────────────────────────────────────────────
// Usage:  MNP.smoothScrollTo('#section-id')
//         MNP.smoothScrollTo(document.querySelector('.some-el'))
//         MNP.smoothScrollTo('#contact', 24)   // extra offset in px
window.MNP = window.MNP || {};

/**
 * Smoothly scrolls to a target element, accounting for the fixed nav height.
 * @param {string|Element} target  CSS selector string OR a DOM element
 * @param {number}         [extra=16]  Additional px offset below the nav
 */
window.MNP.smoothScrollTo = function smoothScrollTo(target, extra = 16) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollIntoView();
    return;
  }

  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
    10
  );
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - extra;
  window.scrollTo({ top, behavior: 'smooth' });
};

// ── Anchor-link wiring (uses the utility above) ─────────────────────────────
(function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.MNP.smoothScrollTo(target);
    });
  });
})();


/* ==========================================================================
   12. LAZY IMAGE LOADING — Native loading="lazy" fallback
   ========================================================================== */

(function initLazyImages() {
  // Modern browsers handle loading="lazy" natively.
  // This just ensures images that come into view get their src set
  // if a data-src pattern is used anywhere.
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (!lazyImgs.length) return;

  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => imgObserver.observe(img));
})();


/* ==========================================================================
   13. COUNTER ANIMATION — Stats bar numbers
   ========================================================================== */

(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);

      const el       = entry.target;
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const duration = 1400; // ms
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * target);
        el.textContent = prefix + current.toLocaleString('nb-NO') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ==========================================================================
   14. HORIZONTAL SCROLL — Property / news card strips
   ========================================================================== */

(function initHorizontalScroll() {
  const strips = document.querySelectorAll('.scroll-strip');
  if (!strips.length) return;

  strips.forEach(strip => {
    let isDown    = false;
    let startX    = 0;
    let scrollLeft= 0;

    strip.addEventListener('mousedown', e => {
      isDown    = true;
      startX    = e.pageX - strip.offsetLeft;
      scrollLeft= strip.scrollLeft;
      strip.style.cursor = 'grabbing';
    });

    strip.addEventListener('mouseleave', () => {
      isDown = false;
      strip.style.cursor = 'grab';
    });

    strip.addEventListener('mouseup', () => {
      isDown = false;
      strip.style.cursor = 'grab';
    });

    strip.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.5;
      strip.scrollLeft = scrollLeft - walk;
    });
  });
})();


/* ==========================================================================
   15. FORM VALIDATION — Contact & guest registration forms
   ========================================================================== */

(function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  if (!forms.length) return;

  forms.forEach(form => {
    const inputs = form.querySelectorAll('[required]');

    function showError(input, msg) {
      let errorEl = input.parentElement.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'font-size:0.8125rem;color:#c0392b;margin-top:4px;display:block;';
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = msg;
      input.style.borderColor = '#c0392b';
    }

    function clearError(input) {
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
      input.style.borderColor = '';
    }

    function validateInput(input) {
      const value = input.value.trim();
      if (!value) {
        showError(input, 'Dette feltet er påkrevd.');
        return false;
      }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(input, 'Skriv inn en gyldig e-postadresse.');
        return false;
      }
      clearError(input);
      return true;
    }

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(192, 57, 43)') validateInput(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      inputs.forEach(input => {
        if (!validateInput(input)) valid = false;
      });

      if (valid) {
        // Mock submission — show success state
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          const original = submitBtn.textContent;
          submitBtn.textContent = 'Sendt!';
          submitBtn.disabled = true;
          submitBtn.style.background = '#3d9970';
          setTimeout(() => {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            form.reset();
          }, 3000);
        }
      }
    });
  });
})();


/* ==========================================================================
   16. GUEST PARKING REGISTRATION — Mock form (parkering.html)
   ========================================================================== */

(function initParkingForm() {
  const form = document.querySelector('#parking-registration-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const plate = form.querySelector('#reg-plate')?.value?.trim().toUpperCase();
    const name  = form.querySelector('#reg-name')?.value?.trim();

    if (!plate || !name) return;

    if (submitBtn) {
      submitBtn.textContent = 'Registrert!';
      submitBtn.style.background = '#3d9970';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = 'Registrer besøkende';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }
      form.reset();
    }, 4000);
  });
})();


/* ==========================================================================
   17. STAGGERED CARD ANIMATION — Auto-apply delays to grid children
   ========================================================================== */

(function initStaggeredCards() {
  const grids = document.querySelectorAll('[data-stagger]');

  grids.forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('fade-in');
      // Cap at 5 delays
      const delay = Math.min(i, 4);
      if (delay > 0) child.classList.add(`fade-in-delay-${delay}`);
    });
  });
})();


/* ==========================================================================
   18. UTILITY HELPERS — Remaining methods added to window.MNP
   (MNP object was seeded in sections 6 and 11 above)
   ========================================================================== */

window.MNP = window.MNP || {};

Object.assign(window.MNP, {

  /**
   * Format a number as Norwegian locale string.
   * MNP.formatNumber(90000) → "90 000"
   */
  formatNumber(n) {
    return Number(n).toLocaleString('nb-NO');
  },

  /**
   * Debounce: delays fn until wait ms after the last call.
   * Usage: window.addEventListener('resize', MNP.debounce(fn, 200))
   */
  debounce(fn, wait = 150) {
    let timer;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  /**
   * Trap keyboard focus within a modal/drawer element.
   * Loops Tab and Shift+Tab between first and last focusable children.
   */
  trapFocus(el) {
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'textarea:not([disabled]), select:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';
    const getFocusable = () => [...el.querySelectorAll(selector)];

    el.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  // smoothScrollTo is defined in section 11
  // Filters       is defined in section 6
});

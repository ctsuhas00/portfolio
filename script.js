/* =====================================================================
   C T SUHAS — PORTFOLIO SCRIPT
   Organized as small independent modules, each initialised on DOMContentLoaded.
===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initActiveSectionHighlight();
  initAccordions();
  initGallery();
  initRevealOnScroll();
  initTypingEffect();
  initCounters();
  initBackToTop();
  initFooterYear();
  initHeroAvatar();
  initContactAvatar();
});

/* ---------------------------------------------------------------------
   1. SCROLL PROGRESS BAR
--------------------------------------------------------------------- */
function initScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ---------------------------------------------------------------------
   2. NAVBAR — blur/shrink on scroll
--------------------------------------------------------------------- */
function initNavbar(){
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ---------------------------------------------------------------------
   3. MOBILE NAV TOGGLE
--------------------------------------------------------------------- */
function initMobileNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------------------
   4. ACTIVE SECTION HIGHLIGHT (scrollspy)
--------------------------------------------------------------------- */
function initActiveSectionHighlight(){
  const navAnchors = document.querySelectorAll('[data-nav]');
  if (!navAnchors.length) return;

  const sections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------------------------------------------------------------------
   5. ACCORDIONS — education timeline, internships, projects, activities
--------------------------------------------------------------------- */
function initAccordions(){
  const triggers = document.querySelectorAll('[data-accordion]');

  triggers.forEach(trigger => {
    const targetId = trigger.getAttribute('data-accordion');
    const panel = document.getElementById(targetId);
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Set panel height for smooth max-height animation
      if (isOpen){
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Recalculate open panel heights on resize (in case content reflows)
  window.addEventListener('resize', () => {
    document.querySelectorAll('[data-accordion][aria-expanded="true"]').forEach(trigger => {
      const panel = document.getElementById(trigger.getAttribute('data-accordion'));
      if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });
}

/* ---------------------------------------------------------------------
   6. IMAGE GALLERY + LIGHTBOX
--------------------------------------------------------------------- */
function initGallery(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImage) return;

  // Group gallery images by their data-gallery attribute
  const galleries = {};
  document.querySelectorAll('.gallery-image').forEach(img => {
    const group = img.getAttribute('data-gallery') || 'default';
    if (!galleries[group]) galleries[group] = [];
    galleries[group].push(img);
  });

  let currentGroup = null;
  let currentIndex = 0;

  const openLightbox = (group, index) => {
    currentGroup = group;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const updateLightboxImage = () => {
    const imgs = galleries[currentGroup];
    if (!imgs || !imgs.length) return;
    const img = imgs[currentIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    const imgs = galleries[currentGroup];
    if (!imgs || !imgs.length) return;
    currentIndex = (currentIndex + 1) % imgs.length;
    updateLightboxImage();
  };

  const showPrev = () => {
    const imgs = galleries[currentGroup];
    if (!imgs || !imgs.length) return;
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    updateLightboxImage();
  };

  document.querySelectorAll('.gallery-image').forEach(img => {
    img.addEventListener('click', () => {
      const group = img.getAttribute('data-gallery') || 'default';
      const index = parseInt(img.getAttribute('data-index'), 10) || 0;
      openLightbox(group, index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Click outside image closes the lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ---------------------------------------------------------------------
   7. REVEAL ON SCROLL (Intersection Observer)
--------------------------------------------------------------------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item, i) => {
    item.style.transitionDelay = Math.min(i % 4, 3) * 0.08 + 's';
    observer.observe(item);
  });
}

/* ---------------------------------------------------------------------
   8. TYPING EFFECT — hero role line
--------------------------------------------------------------------- */
function initTypingEffect(){
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Electronics Engineer',
    'IoT Developer',
    'Entrepreneur'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 35 : 65);
  };

  tick();
}

/* ---------------------------------------------------------------------
   9. ANIMATED COUNTERS — hero stats
--------------------------------------------------------------------- */
function initCounters(){
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ---------------------------------------------------------------------
   10. BACK TO TOP BUTTON
--------------------------------------------------------------------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------------------
   11. FOOTER YEAR
--------------------------------------------------------------------- */
function initFooterYear(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------
   12. HERO AVATAR SYSTEM — independent of the Contact avatar below.
   Single fixed illustration + message. Docks into a small floating
   assistant once the hero scrolls out of view, and collapses to a
   tap-to-open button on mobile.
--------------------------------------------------------------------- */
function initHeroAvatar(){
  const avatar = document.getElementById('heroAvatar');
  const bubble = document.getElementById('heroAvatarBubble');
  const closeBtn = document.getElementById('heroAvatarBubbleClose');
  const mobileToggle = document.getElementById('heroAvatarMobileToggle');
  const hero = document.getElementById('top');

  if (!avatar || !bubble) return;

  // Show the greeting shortly after load
  bubble.classList.add('is-visible');

  if (closeBtn){
    closeBtn.addEventListener('click', () => {
      bubble.classList.remove('is-visible');
    });
  }

  if (mobileToggle){
    mobileToggle.addEventListener('click', () => {
      bubble.classList.toggle('is-visible');
    });
  }

  // Dock into the floating assistant once the hero scrolls out of view
  if (hero){
    const dockObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        avatar.classList.toggle('is-docked', !entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' });
    dockObserver.observe(hero);
  }
}

/* ---------------------------------------------------------------------
   13. CONTACT AVATAR SYSTEM — independent of the Hero avatar above.
   Single fixed inline illustration; never docks or floats. Its own
   bubble open/close + mobile toggle, entirely separate DOM and state.
--------------------------------------------------------------------- */
function initContactAvatar(){
  const avatar = document.getElementById('contactAvatar');
  const bubble = document.getElementById('contactAvatarBubble');
  const closeBtn = document.getElementById('contactAvatarBubbleClose');
  const mobileToggle = document.getElementById('contactAvatarMobileToggle');

  if (!avatar || !bubble) return;

  bubble.classList.add('is-visible');

  if (closeBtn){
    closeBtn.addEventListener('click', () => {
      bubble.classList.remove('is-visible');
    });
  }

  if (mobileToggle){
    mobileToggle.addEventListener('click', () => {
      bubble.classList.toggle('is-visible');
    });
  }
}
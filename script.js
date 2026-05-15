/* ============================================================
   STAY HOME MASSAGE GOLD COAST — script.js
   ============================================================ */

/* ── Lenis smooth scroll ────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.35,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ticker
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── Navigation scroll state ────────────────────────────────── */
const nav = document.getElementById('nav');

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('nav--scrolled', scroll > 60);
});

/* ── Hamburger menu ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
  });
});

/* ── Smooth-scroll anchor links ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    }
  });
});

/* ── Hero entrance animation ────────────────────────────────── */
// Set initial invisible states here (not in CSS) so content is always
// visible as a fallback if GSAP CDN is slow or blocked.
gsap.set('.hero__label',          { opacity: 0 });
gsap.set('.hero__line',           { opacity: 0, y: 70 });
gsap.set('.hero__sub',            { opacity: 0 });
gsap.set('.hero__actions',        { opacity: 0 });
gsap.set('.hero__scroll-indicator', { opacity: 0 });

const heroTL = gsap.timeline({ delay: 0.15 });

heroTL
  .to('.hero__label', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  })
  .to('.hero__line', {
    opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power4.out',
  }, '-=0.4')
  .to('.hero__sub', {
    opacity: 1, duration: 0.9, ease: 'power3.out',
  }, '-=0.55')
  .to('.hero__actions', {
    opacity: 1, duration: 0.8, ease: 'power3.out',
  }, '-=0.5')
  .to('.hero__scroll-indicator', {
    opacity: 0.75, duration: 0.6, ease: 'power2.out',
  }, '-=0.3');

/* ── Hero parallax ──────────────────────────────────────────── */
gsap.to('#heroBg', {
  yPercent: 22,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ── Reusable fade-up reveal ────────────────────────────────── */
function revealUp(elements, trigger, opts = {}) {
  gsap.from(elements, {
    scrollTrigger: {
      trigger: trigger || elements,
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: opts.y ?? 50,
    duration: opts.duration ?? 0.9,
    stagger: opts.stagger ?? 0,
    ease: opts.ease ?? 'power3.out',
    delay: opts.delay ?? 0,
  });
}

function revealFrom(elements, trigger, from = {}, scrollOpts = {}) {
  gsap.from(elements, {
    scrollTrigger: {
      trigger: trigger || elements,
      start: scrollOpts.start ?? 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...from,
  });
}

/* ── Section labels & titles ────────────────────────────────── */
document.querySelectorAll('.section-label, .section-title, .section-sub').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    opacity: 0,
    y: 36,
    duration: 0.85,
    ease: 'power3.out',
  });
});

/* ── Services cards ─────────────────────────────────────────── */
revealUp('.service-card', '.services__grid', { stagger: 0.1 });

/* ── About section ──────────────────────────────────────────── */
revealFrom('.about__content', '.about__inner', { x: -60 });
revealFrom('.about__visual', '.about__inner', { x: 60, delay: 0.18 });

/* ── Stat counters ──────────────────────────────────────────── */
document.querySelectorAll('.stat__num').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter() {
      gsap.to(el, {
        textContent: target,
        duration: 1.8,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); },
      });
    },
  });
});

/* ── Trust pills ────────────────────────────────────────────── */
revealUp('.trust-pill', '.about__trust', { stagger: 0.1, y: 20 });

/* ── How It Works steps ─────────────────────────────────────── */
revealUp('.step', '.steps', { stagger: 0.18 });

/* ── Gallery items ──────────────────────────────────────────── */
gsap.from('.gallery__item', {
  scrollTrigger: { trigger: '.gallery__grid', start: 'top 82%' },
  opacity: 0,
  scale: 0.96,
  duration: 0.9,
  stagger: 0.1,
  ease: 'power3.out',
});

/* ── Areas ──────────────────────────────────────────────────── */
revealFrom('.areas__content', '.areas__inner', { x: -50 });
gsap.from('.areas__list li', {
  scrollTrigger: { trigger: '.areas__list', start: 'top 82%' },
  opacity: 0,
  x: 28,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power3.out',
});

/* ── Pricing cards ──────────────────────────────────────────── */
revealUp('.pricing-card', '.pricing__grid', { stagger: 0.14 });

/* ── Testimonials ───────────────────────────────────────────── */
revealUp('.testimonial', '.testimonials__grid', { stagger: 0.15 });

/* ── FAQ items ──────────────────────────────────────────────── */
revealUp('.faq-item', '.faq__list', { stagger: 0.08, y: 30 });

/* ── Final CTA ──────────────────────────────────────────────── */
revealUp('.final-cta__content', '.final-cta', { y: 60 });

/* ── FAQ accordion ──────────────────────────────────────────── */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-item__a');
    const isOpen = item.classList.contains('is-open');

    // Close all open items
    document.querySelectorAll('.faq-item.is-open').forEach(open => {
      open.classList.remove('is-open');
      open.querySelector('.faq-item__a').style.maxHeight = '0';
      open.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });

    // Open the clicked one if it was closed
    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Floating WhatsApp button ───────────────────────────────── */
const waFloat = document.getElementById('waFloat');

ScrollTrigger.create({
  trigger: '.hero',
  start: 'bottom 80%',
  onEnter: () => {
    waFloat.classList.add('is-visible');
    gsap.fromTo(waFloat,
      { scale: 0.6 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.6)' }
    );
  },
  onLeaveBack: () => {
    gsap.to(waFloat, {
      scale: 0.6, duration: 0.3, ease: 'power2.in',
      onComplete: () => waFloat.classList.remove('is-visible'),
    });
  },
});

/* ── Refresh ScrollTrigger after fonts load ─────────────────── */
document.fonts.ready.then(() => ScrollTrigger.refresh());

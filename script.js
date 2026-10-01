(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const body = document.body;

  window.addEventListener('load', () => {
    setTimeout(() => body.classList.add('loaded'), 500);
  });

  // Mobile nav
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('.mobile-nav');
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileNav?.classList.toggle('open', !open);
  });
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('open');
  }));

  // Scroll reveal with light stagger
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement ? $$('.reveal', entry.target.parentElement) : [];
        const idx = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(idx * 0.07, 0.35)}s`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -45px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else revealItems.forEach(el => el.classList.add('in-view'));

  // Top scroll progress
  const progress = $('.scroll-progress span');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Menu filters: cards remain real links to the live menu.
  const filters = $$('.filter');
  const cards = $$('.menu-card');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.toggle('active', f === filter));
      const selected = filter.dataset.filter;
      cards.forEach(card => {
        const match = selected === 'all' || card.dataset.category === selected;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // Gallery lightbox
  const galleryItems = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const galleryData = galleryItems.map(item => ({
    src: $('img', item)?.src,
    alt: $('img', item)?.alt || '',
    caption: $('span', item)?.textContent || ''
  }));
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = (index + galleryData.length) % galleryData.length;
    const item = galleryData[lightboxIndex];
    if (!item || !lightbox) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lock');
  }
  function closeLightbox() {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    body.classList.remove('lock');
  }
  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(Number(item.dataset.lightboxIndex))));
  $('.lightbox-close')?.addEventListener('click', closeLightbox);
  $('.lightbox-prev')?.addEventListener('click', () => openLightbox(lightboxIndex - 1));
  $('.lightbox-next')?.addEventListener('click', () => openLightbox(lightboxIndex + 1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Reviews: real excerpts from the current public Zomato review feed, plus live link.
  const reviewCards = $$('.review-card');
  const showReview = index => {
    reviewCards.forEach((card, i) => card.classList.toggle('active', i === index));
  };
  let reviewIndex = 0;
  $('.review-nav.prev')?.addEventListener('click', () => {
    reviewIndex = (reviewIndex - 1 + reviewCards.length) % reviewCards.length;
    showReview(reviewIndex);
  });
  $('.review-nav.next')?.addEventListener('click', () => {
    reviewIndex = (reviewIndex + 1) % reviewCards.length;
    showReview(reviewIndex);
  });
  let reviewTimer = setInterval(() => {
    reviewIndex = (reviewIndex + 1) % reviewCards.length;
    showReview(reviewIndex);
  }, 6000);
  $('.review-shell')?.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  $('.review-shell')?.addEventListener('mouseleave', () => {
    reviewTimer = setInterval(() => {
      reviewIndex = (reviewIndex + 1) % reviewCards.length;
      showReview(reviewIndex);
    }, 6000);
  });

  // Review modal. On a deployed Netlify site the form is a real Netlify form.
  const reviewModal = $('#reviewModal');
  const openReview = $('#openReview');
  const modalClose = $('.modal-close', reviewModal);
  const reviewForm = $('#reviewForm');
  const formStatus = $('#formStatus');
  openReview?.addEventListener('click', () => {
    reviewModal.classList.add('open');
    reviewModal.setAttribute('aria-hidden', 'false');
    body.classList.add('lock');
    setTimeout(() => $('input[name="name"]', reviewForm)?.focus(), 100);
  });
  const closeReviewModal = () => {
    reviewModal?.classList.remove('open');
    reviewModal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('lock');
  };
  modalClose?.addEventListener('click', closeReviewModal);
  reviewModal?.addEventListener('click', e => { if (e.target === reviewModal) closeReviewModal(); });

  reviewForm?.addEventListener('submit', e => {
    // Local demo fallback: make the review appear instantly in this browser.
    // Netlify will process the form normally after deployment.
    const isLocalFile = location.protocol === 'file:' || /localhost|127\.0\.0\.1/.test(location.hostname);
    if (!isLocalFile) return;
    e.preventDefault();
    const data = new FormData(reviewForm);
    const entry = {
      name: String(data.get('name') || 'Guest').trim(),
      rating: String(data.get('rating') || '5'),
      message: String(data.get('message') || '').trim(),
      created: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('bb_demo_reviews') || '[]');
    existing.push(entry);
    localStorage.setItem('bb_demo_reviews', JSON.stringify(existing));
    formStatus.textContent = 'Saved in this browser for the demo. For the live site, this form submits to Netlify.';
    reviewForm.reset();
  });

  // Keyboard controls
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLightbox(); closeReviewModal(); }
    if (lightbox?.classList.contains('open')) {
      if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
    }
  });

  // Subtle magnetic interaction on desktop.
  if (window.matchMedia('(hover:hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.classList.add('cursor-ready');
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`; dot.style.opacity = 1;
      ring.style.opacity = 1;
    }, { passive: true });
    const cursorLoop = () => {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();
    $$('.magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => { ring.classList.remove('active'); el.style.transform = ''; });
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * .08;
        const y = (e.clientY - (rect.top + rect.height / 2)) * .08;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
    });
  }
})();

(() => {
  const body = document.body;
  const nav = document.querySelector('#nav');
  const navToggle = document.querySelector('#navToggle');
  const navMenu = document.querySelector('#navMenu');
  const progress = document.querySelector('#scrollProgress');

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  };

  navToggle?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .14 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in'));
  }

  const chips = document.querySelectorAll('.gal-chip');
  const tiles = document.querySelectorAll('.gtile');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle('on', item === chip));
    tiles.forEach((tile) => tile.classList.toggle('is-hidden', filter !== 'all' && tile.dataset.cat !== filter));
  }));

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightboxImage');
  const lightboxCaption = document.querySelector('#lightboxCaption');
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  tiles.forEach((tile) => tile.addEventListener('click', () => {
    const image = tile.querySelector('img');
    if (!image || !lightbox || !lightboxImage) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    if (lightboxCaption) lightboxCaption.textContent = tile.querySelector('figcaption')?.textContent || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }));
  lightbox?.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeLightbox(); setMenu(false); } });

  document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try { await navigator.clipboard.writeText(value); } catch (_) { /* Clipboard may be unavailable on file previews. */ }
    const original = button.textContent;
    button.textContent = 'Copied ✓';
    window.setTimeout(() => { button.textContent = original; }, 1600);
  }));
})();

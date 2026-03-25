
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    });
  }

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const title = lightbox.querySelector('h3');
    const text = lightbox.querySelector('p');
    document.querySelectorAll('[data-lightbox]').forEach(card => {
      card.addEventListener('click', () => {
        img.src = card.dataset.image;
        img.alt = card.dataset.title || 'Gallery image';
        title.textContent = card.dataset.title || '';
        text.textContent = card.dataset.caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    const close = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    lightbox.querySelectorAll('[data-close-lightbox]').forEach(btn => btn.addEventListener('click', close));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }
});

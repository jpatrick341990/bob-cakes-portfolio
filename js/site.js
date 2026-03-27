
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


(function () {
  const STORAGE_KEY = 'bobCakesPortfolioItems';

  function getPortfolioItems() {
    try {
      const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeCategory(value) {
    return String(value || '').trim().toLowerCase();
  }

  function buildCard(item) {
    const title = escapeHtml(item.title || 'Portfolio item');
    const caption = escapeHtml(item.description || 'Custom order example');
    const image = escapeHtml(item.image || '');
    return `
      <article class="gallery-card dynamic-card" data-lightbox data-image="${image}" data-title="${title}" data-caption="${caption}">
        <div class="photo" style="background-image:url('${image}')"></div>
        <div class="copy">
          <h4>${title}</h4>
          <p>${caption}</p>
        </div>
      </article>
    `;
  }

  function bindLightboxCards(scope) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !scope) return;
    const img = lightbox.querySelector('img');
    const title = lightbox.querySelector('h3');
    const text = lightbox.querySelector('p');
    scope.querySelectorAll('[data-lightbox]').forEach(card => {
      if (card.dataset.boundLightbox === 'true') return;
      card.dataset.boundLightbox = 'true';
      card.addEventListener('click', () => {
        img.src = card.dataset.image;
        img.alt = card.dataset.title || 'Gallery image';
        title.textContent = card.dataset.title || '';
        text.textContent = card.dataset.caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function renderDynamicPortfolio() {
    const containers = document.querySelectorAll('[data-dynamic-portfolio]');
    if (!containers.length) return;
    const items = getPortfolioItems().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    containers.forEach(container => {
      const category = normalizeCategory(container.dataset.category || 'all');
      const limit = parseInt(container.dataset.limit || '0', 10);
      let filtered = items.filter(item => category === 'all' || normalizeCategory(item.category) === category);
      if (limit > 0) filtered = filtered.slice(0, limit);
      if (!filtered.length) {
        container.innerHTML = '<div class="empty-admin-note">New uploads will show here after Jamie adds them in the admin area.</div>';
        return;
      }
      container.innerHTML = filtered.map(buildCard).join('');
      bindLightboxCards(container);
    });
  }

  document.addEventListener('DOMContentLoaded', renderDynamicPortfolio);
})();


(function () {
  const LOGIN_KEY = 'bobCakesAdminSession';
  const STORAGE_KEY = 'bobCakesPortfolioItems';
  const ADMIN_USER = 'jamie';
  const ADMIN_PASS = 'bobcakes2026!';

  function getItems() {
    try {
      const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isLoggedIn() {
    return sessionStorage.getItem(LOGIN_KEY) === 'true';
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = 'admin-login.html';
    }
  }

  function renderItems() {
    const list = document.getElementById('admin-items');
    if (!list) return;
    const items = getItems().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!items.length) {
      list.innerHTML = '<div class="empty-admin-note">No custom portfolio uploads yet.</div>';
      return;
    }
    list.innerHTML = items.map(item => `
      <article class="admin-item-card">
        <div class="admin-item-preview" style="background-image:url('${escapeHtml(item.image || '')}')"></div>
        <div class="admin-item-copy">
          <span class="admin-tag">${escapeHtml(item.category || 'uncategorized')}</span>
          <h3>${escapeHtml(item.title || 'Untitled')}</h3>
          <p>${escapeHtml(item.description || '')}</p>
          <button class="button button-primary admin-delete" data-id="${escapeHtml(item.id)}" type="button">Delete</button>
        </div>
      </article>
    `).join('');

    list.querySelectorAll('.admin-delete').forEach(button => {
      button.addEventListener('click', () => {
        const remaining = getItems().filter(item => item.id !== button.dataset.id);
        saveItems(remaining);
        renderItems();
      });
    });
  }

  function wireLogin() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = form.querySelector('[name="username"]').value.trim();
      const password = form.querySelector('[name="password"]').value;
      const note = document.getElementById('login-note');
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem(LOGIN_KEY, 'true');
        window.location.href = 'portfolio-admin.html';
      } else if (note) {
        note.textContent = 'That sign-in did not match. Try again.';
      }
    });
  }

  function wireAdmin() {
    const adminPage = document.getElementById('portfolio-admin-page');
    if (!adminPage) return;
    requireLogin();

    const form = document.getElementById('portfolio-form');
    const fileInput = document.getElementById('portfolio-image');
    const imagePreview = document.getElementById('image-preview');
    const signOut = document.getElementById('admin-signout');
    let uploadedImage = '';

    if (signOut) {
      signOut.addEventListener('click', () => {
        sessionStorage.removeItem(LOGIN_KEY);
        window.location.href = 'admin-login.html';
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          uploadedImage = reader.result;
          if (imagePreview) {
            imagePreview.style.backgroundImage = `url('${uploadedImage}')`;
            imagePreview.classList.add('has-image');
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = form.querySelector('[name="title"]').value.trim();
        const category = form.querySelector('[name="category"]').value.trim();
        const description = form.querySelector('[name="description"]').value.trim();
        const imagePath = form.querySelector('[name="imagePath"]').value.trim();
        const image = uploadedImage || imagePath;
        if (!title || !category || !description || !image) {
          alert('Please add a title, category, description, and image.');
          return;
        }
        const items = getItems();
        items.push({
          id: 'item-' + Date.now(),
          title,
          category,
          description,
          image,
          createdAt: Date.now()
        });
        saveItems(items);
        form.reset();
        uploadedImage = '';
        if (imagePreview) {
          imagePreview.style.backgroundImage = '';
          imagePreview.classList.remove('has-image');
        }
        renderItems();
      });
    }

    renderItems();
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireLogin();
    wireAdmin();
  });
})();

/* =========================================================
   Anywhere Appliance — Main JavaScript
   Navigation, TOC, Tables, Animations, Search
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initStickyHeader();
  initTableOfContents();
  initResponsiveTables();
  initScrollAnimations();
  initImageLazyLoad();
  fixImagePaths();
});

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close (×) button inside the menu
  const closeBtn = document.getElementById('mobile-menu-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ---- Sticky Header ---- */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---- Table of Contents ---- */
function initTableOfContents() {
  const tocContainer = document.querySelector('.toc-container');
  const postContent = document.querySelector('.post-content');
  if (!tocContainer || !postContent) return;

  const headings = postContent.querySelectorAll('h2, h3');
  if (headings.length < 2) {
    tocContainer.style.display = 'none';
    return;
  }

  const tocList = tocContainer.querySelector('.toc-list');
  if (!tocList) return;

  headings.forEach((heading, index) => {
    // Create ID for the heading
    const id = heading.id || 'section-' + (index + 1);
    heading.id = id;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = heading.textContent;
    a.classList.add('toc-' + heading.tagName.toLowerCase());

    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });

    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Toggle TOC
  const tocToggle = tocContainer.querySelector('.toc-toggle');
  const tocHeader = tocContainer.querySelector('.toc-header');
  if (tocToggle && tocHeader) {
    tocHeader.addEventListener('click', () => {
      tocToggle.classList.toggle('collapsed');
      tocList.style.display = tocToggle.classList.contains('collapsed') ? 'none' : 'block';
    });

    // Collapse by default on mobile/tablet so the TOC doesn't push content down
    if (window.matchMedia('(max-width: 900px)').matches) {
      tocToggle.classList.add('collapsed');
      tocList.style.display = 'none';
    }
  }

  // Highlight active TOC item on scroll
  const tocLinks = tocList.querySelectorAll('a');
  window.addEventListener('scroll', () => {
    let current = '';
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 150) {
        current = heading.id;
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ---- Responsive Tables ---- */
function initResponsiveTables() {
  const tables = document.querySelectorAll('.post-content table');
  tables.forEach(table => {
    if (!table.parentElement.classList.contains('table-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ---- Lazy Load Images ---- */
function initImageLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    imgObserver.observe(img);
  });
}

/* ---- Fix Image Paths ---- */
function fixImagePaths() {
  // Fix any remaining broken wp-content image URLs
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (src.includes('wp-content/uploads')) {
      const filename = src.split('/').pop();
      // Try to find in batch folders
      img.setAttribute('data-original-src', src);
      // Keep the existing path, it should already be fixed by the generator
    }
  });
}

/* ---- Simple Client-Side Search ---- */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }

    // Search data is embedded in the page as window.searchData
    if (!window.searchData) return;

    const results = window.searchData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(query))
    ).slice(0, 8);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      searchResults.innerHTML = results.map(r => `
        <a href="${r.url}" class="search-result-item">
          <span class="search-result-title">${highlightMatch(r.title, query)}</span>
          <span class="search-result-type">${r.type}</span>
        </a>
      `).join('');
    }
    searchResults.style.display = 'block';
  });
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

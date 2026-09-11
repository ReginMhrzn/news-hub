const today = new Date();
document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

document.getElementById('search-toggle').addEventListener('click', () => {
  const ms = document.getElementById('mobile-search');
  ms.classList.toggle('hidden');
  if (!ms.classList.contains('hidden')) {
    document.getElementById('search-mobile').focus();
  }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active', 'bg-red-600', 'text-white');
      b.classList.add('bg-gray-100', 'text-gray-700');
    });
    btn.classList.add('active', 'bg-red-600', 'text-white');
    btn.classList.remove('bg-gray-100', 'text-gray-700');

    const cat = btn.textContent.trim();
    document.querySelectorAll('#article-grid .news-card').forEach(card => {
      if (cat === 'All' || card.dataset.category.toLowerCase().includes(cat.toLowerCase())) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

const articleModal = document.getElementById('article-modal');
const modalImage = document.getElementById('modal-image');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalAvatar = document.getElementById('modal-avatar');
const modalTime = document.getElementById('modal-time');
const modalRead = document.getElementById('modal-read');
const modalContent = document.getElementById('modal-content');

function getInitials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function openArticle(card) {
  const d = card.dataset;

  modalImage.src = d.image;
  modalCategory.textContent = d.category;
  modalTitle.textContent = d.title;
  modalAuthor.textContent = d.author;
  modalAvatar.textContent = getInitials(d.author);
  modalTime.textContent = d.time;
  modalRead.textContent = d.read;

  const paragraphs = d.content.split('. ').reduce((acc, sentence, i) => {
    const idx = Math.floor(i / 3);
    acc[idx] = (acc[idx] || '') + sentence + '. ';
    return acc;
  }, []);

  modalContent.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

  articleModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  articleModal.querySelector('.relative.h-full').scrollTop = 0;
}

function closeArticle() {
  articleModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.news-card').forEach(card => {
  card.addEventListener('click', () => openArticle(card));
});

document.getElementById('close-article').addEventListener('click', closeArticle);
document.getElementById('close-article-bottom').addEventListener('click', closeArticle);
document.getElementById('article-backdrop').addEventListener('click', closeArticle);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !articleModal.classList.contains('hidden')) {
    closeArticle();
  }
});

const searchInline = document.getElementById('search-inline');
const searchMobile = document.getElementById('search-mobile');
const searchInfo = document.getElementById('search-info');
const searchTermDisplay = document.getElementById('search-term-display');
const searchCount = document.getElementById('search-count');
const noSearchResults = document.getElementById('no-search-results');
const heroSection = document.getElementById('hero-section');
const filterSection = document.getElementById('filter-section');

function performSearch(term) {
  term = term.trim().toLowerCase();

  const allCards = document.querySelectorAll('.news-card');

  if (!term) {
    searchInfo.classList.add('hidden');
    noSearchResults.classList.add('hidden');
    heroSection.classList.remove('hidden');
    filterSection.classList.remove('hidden');
    allCards.forEach(c => c.style.display = '');
    return;
  }

  let matches = 0;

  allCards.forEach(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const category = (card.dataset.category || '').toLowerCase();
    const author = (card.dataset.author || '').toLowerCase();
    const content = (card.dataset.content || '').toLowerCase();

    const hit = title.includes(term) || category.includes(term) ||
                author.includes(term) || content.includes(term);

    if (hit) {
      card.style.display = '';
      matches++;
    } else {
      card.style.display = 'none';
    }
  });

  heroSection.classList.add('hidden');
  filterSection.classList.add('hidden');

  searchInfo.classList.remove('hidden');
  searchTermDisplay.textContent = term;
  searchCount.textContent = matches;

  if (matches === 0) {
    noSearchResults.classList.remove('hidden');
  } else {
    noSearchResults.classList.add('hidden');
  }
}

searchInline.addEventListener('input', e => {
  searchMobile.value = e.target.value;
  performSearch(e.target.value);
});

searchMobile.addEventListener('input', e => {
  searchInline.value = e.target.value;
  performSearch(e.target.value);
});

document.getElementById('clear-search').addEventListener('click', () => {
  searchInline.value = '';
  searchMobile.value = '';
  performSearch('');
});

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (window.innerWidth >= 768) {
      searchInline.focus();
    } else {
      document.getElementById('mobile-search').classList.remove('hidden');
      searchMobile.focus();
    }
  }
});
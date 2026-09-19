/* ==========================================================================
   Boomer Tech Help — guides page
   Builds the guide library from js/guides-data.js and wires up search and
   topic filtering. Dependency-free. There is one shared filter state
   (search words + topic); both search boxes, the topic cards and the topic
   menu all read and write it, so they can never disagree.
   ========================================================================== */

(function () {
  'use strict';

  var lib = window.BTH_GUIDE_LIBRARY;
  var grid = document.getElementById('guide-grid');
  if (!lib || !grid) { return; }

  // ---- Icons (same drawing style as the icons in index.html) ----
  var ICONS = {
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"></rect><line x1="11" y1="18" x2="13" y2="18"></line>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"></path>',
    shield: '<path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"></path><path d="m9.5 12 2 2 3.5-3.5"></path>',
    wifi: '<path d="M2 8.8a15 15 0 0 1 20 0"></path><path d="M5.5 12.4a10 10 0 0 1 13 0"></path><path d="M9 16a5 5 0 0 1 6 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>',
    key: '<circle cx="8" cy="15" r="4"></circle><path d="m11 12 9-9M16 7l3 3M14 9l2 2"></path>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"></rect><path d="m22 8-6 4 6 4Z"></path>',
    tv: '<rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
    clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    hourglass: '<path d="M6 2h12M6 22h12"></path><path d="M7 2v4a5 5 0 0 0 2 4l3 2-3 2a5 5 0 0 0-2 4v4M17 2v4a5 5 0 0 1-2 4l-3 2 3 2a5 5 0 0 1 2 4v4"></path>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Data lookups ----
  var categories = lib.categories;
  var guides = lib.guides;
  var categoryById = {};
  categories.forEach(function (c) { categoryById[c.id] = c; });

  // Lowercase; drop apostrophes and hyphens so "won't" / "wont" and "Wi-Fi" / "wifi"
  // match each other; treat any other punctuation as a space.
  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/['‘’\-]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  var searchable = {};
  guides.forEach(function (g) {
    searchable[g.id] = normalize([g.title, g.description, categoryById[g.category].name, g.keywords.join(' ')].join(' '));
  });

  var countByCategory = {};
  guides.forEach(function (g) {
    countByCategory[g.category] = (countByCategory[g.category] || 0) + 1;
  });

  function guideCount(n) {
    return n === 0 ? 'No guides yet' : n + (n === 1 ? ' guide' : ' guides');
  }

  // ---- Elements ----
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-guide-search]'));
  var popularSection = document.getElementById('popular-section');
  var popularGrid = document.getElementById('popular-grid');
  var topicGrid = document.getElementById('topic-grid');
  var topicSelect = document.getElementById('topic-select');
  var libraryHeading = document.getElementById('all-guides-heading');
  var librarySection = document.getElementById('all-guides');
  var resultCount = document.getElementById('result-count');
  var resetButton = document.getElementById('reset-filters');
  var emptyState = document.getElementById('empty-state');
  var emptyMessage = document.getElementById('empty-message');
  var emptyReset = document.getElementById('empty-reset');
  var heroStatus = document.getElementById('hero-status');
  var heroStatusText = document.getElementById('hero-status-text');
  var heroResultsLink = document.getElementById('hero-results-link');
  var liveRegion = document.getElementById('guide-live');

  var state = { query: '', category: '' };

  // ---- Card markup ----
  function cardHtml(g, idPrefix) {
    var cat = categoryById[g.category];
    var titleId = idPrefix + '-' + g.id;
    // Guides without an article page get a status, never a link to a page that doesn't exist.
    var status = g.url
      ? '<a class="btn btn-secondary guide-link" href="' + esc(g.url) + '">Read the guide<span class="visually-hidden">: ' + esc(g.title) + '</span>' + icon('arrow') + '</a>'
      : '<p class="guide-status">' + icon('hourglass') + 'Coming soon</p>';

    return '<li>' +
      '<article class="guide-card" aria-labelledby="' + titleId + '">' +
        '<div class="guide-card-top">' +
          '<span class="guide-icon">' + icon(cat.icon) + '</span>' +
          '<p class="guide-category">' + esc(cat.name) + '</p>' +
        '</div>' +
        '<h3 id="' + titleId + '">' + esc(g.title) + '</h3>' +
        '<p class="guide-desc">' + esc(g.description) + '</p>' +
        '<div class="guide-meta">' +
          '<p class="guide-time">' + icon('clock') + g.readingMinutes + ' minute read</p>' +
          status +
        '</div>' +
      '</article>' +
    '</li>';
  }

  // ---- One-time rendering: popular guides, topic cards, topic menu ----
  var popular = guides
    .filter(function (g) { return g.popular; })
    .sort(function (a, b) { return a.popular - b.popular; });
  popularGrid.innerHTML = popular.map(function (g) { return cardHtml(g, 'popular'); }).join('');

  topicGrid.innerHTML = categories.map(function (c) {
    return '<li><button type="button" class="topic-card" data-topic="' + esc(c.id) + '" aria-pressed="false">' +
      '<span class="topic-card-top">' +
        '<span class="guide-icon">' + icon(c.icon) + '</span>' +
        '<span class="topic-selected">' + icon('check') + '<span class="topic-selected-text">Selected</span></span>' +
      '</span>' +
      '<span class="topic-name">' + esc(c.name) + '</span>' +
      '<span class="topic-desc">' + esc(c.description) + '</span>' +
      '<span class="topic-count">' + guideCount(countByCategory[c.id] || 0) + '</span>' +
    '</button></li>';
  }).join('');

  topicSelect.innerHTML = '<option value="">All topics</option>' + categories.map(function (c) {
    return '<option value="' + esc(c.id) + '">' + esc(c.name) + ' (' + (countByCategory[c.id] || 0) + ')</option>';
  }).join('');

  var topicButtons = Array.prototype.slice.call(topicGrid.querySelectorAll('.topic-card'));

  // ---- Filtering ----
  function matches(g) {
    if (state.category && g.category !== state.category) { return false; }
    var words = normalize(state.query).split(' ').filter(Boolean);
    return words.every(function (w) { return searchable[g.id].indexOf(w) !== -1; });
  }

  function countText(n) {
    var q = state.query.trim();
    var cat = state.category ? categoryById[state.category].name : '';
    if (!q && !cat) { return 'Showing all ' + n + ' guides'; }
    var found = n === 0 ? 'No guides found' : n + (n === 1 ? ' guide found' : ' guides found');
    if (q && cat) { return found + ' for “' + q + '” in ' + cat; }
    if (q) { return found + ' for “' + q + '”'; }
    return n === 0 ? 'No guides in ' + cat + ' yet' : n + (n === 1 ? ' guide' : ' guides') + ' in ' + cat;
  }

  // Announce results after typing pauses, so a screen reader isn't interrupted on every keystroke.
  var announceTimer;
  function announce(text) {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () { liveRegion.textContent = text; }, 500);
  }

  function update() {
    var hasQuery = state.query.trim() !== '';
    var isFiltered = hasQuery || state.category !== '';
    var shown = guides.filter(matches);
    var text = countText(shown.length);

    // Keep both search boxes, the topic menu and the topic cards in step.
    searchInputs.forEach(function (input) {
      if (input.value !== state.query) { input.value = state.query; }
      var clear = input.parentNode.querySelector('[data-search-clear]');
      if (clear) { clear.hidden = state.query === ''; }
    });
    topicSelect.value = state.category;
    topicButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-topic') === state.category));
    });

    // The popular six are the default view; while filtering they'd just repeat the results below.
    popularSection.hidden = isFiltered;

    heroStatus.hidden = !hasQuery;
    heroStatusText.textContent = text;

    resultCount.textContent = text;
    resetButton.hidden = !isFiltered;
    grid.innerHTML = shown.map(function (g) { return cardHtml(g, 'all'); }).join('');
    grid.hidden = shown.length === 0;

    emptyState.hidden = shown.length !== 0;
    if (shown.length === 0) {
      // A topic with no guides yet is not a failed search, so it gets its own wording.
      emptyMessage.textContent = hasQuery
        ? 'We couldn’t find a guide matching that search. Try a different word or browse the topics above.'
        : 'There are no guides in this topic yet. New guides are on the way — try another topic in the meantime.';
    }

    announce(text);
  }

  function goToResults() {
    librarySection.scrollIntoView();
    libraryHeading.focus({ preventScroll: true });
  }

  function reset() {
    state.query = '';
    state.category = '';
    update();
    // The button that was just pressed disappears, so hand focus somewhere sensible.
    document.getElementById('library-search').focus();
  }

  // ---- Events ----
  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      state.query = input.value;
      update();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value !== '') {
        e.preventDefault();
        state.query = '';
        update();
      }
    });

    var form = input.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (state.query.trim() !== '') { goToResults(); }
      });
    }

    var clear = input.parentNode.querySelector('[data-search-clear]');
    if (clear) {
      clear.addEventListener('click', function () {
        state.query = '';
        update();
        input.focus();
      });
    }
  });

  topicButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var id = button.getAttribute('data-topic');
      if (state.category === id) {
        state.category = '';   // pressing the selected topic again clears it
        update();
      } else {
        state.category = id;
        update();
        goToResults();
      }
    });
  });

  topicSelect.addEventListener('change', function () {
    state.category = topicSelect.value;
    update();
  });

  resetButton.addEventListener('click', reset);
  emptyReset.addEventListener('click', reset);
  heroResultsLink.addEventListener('click', function (e) {
    e.preventDefault();
    goToResults();
  });

  update();
  // Nothing has changed yet, so there's nothing to announce on first load.
  window.clearTimeout(announceTimer);
})();

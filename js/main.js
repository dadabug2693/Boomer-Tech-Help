/* ==========================================================================
   Boomer Tech Help — main.js
   Minimal, dependency-free. Edit SITE_CONFIG below to update shared URLs
   across the whole site in one place.
   ========================================================================== */

(function () {
  'use strict';

  var SITE_CONFIG = {
    youtubeUrl: 'https://www.youtube.com/@BoomerTechHelps',
    youtubeShortsUrl: 'https://www.youtube.com/@BoomerTechHelps/shorts',
    siteUrl: 'https://boomertechhelps.com'
  };

  // Apply the shared YouTube URL to every link marked with data-youtube-link.
  // (Anchors also carry a real href in the HTML as a no-JS fallback.)
  document.querySelectorAll('[data-youtube-link]').forEach(function (el) {
    el.setAttribute('href', SITE_CONFIG.youtubeUrl);
  });
  document.querySelectorAll('[data-youtube-shorts-link]').forEach(function (el) {
    el.setAttribute('href', SITE_CONFIG.youtubeShortsUrl);
  });

  // ---- Mobile nav ----
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Footer year ----
  var yearEl = document.getElementById('current-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ---- Share button (progressive enhancement, with copy-link fallback) ----
  var shareBtn = document.getElementById('share-button');
  var copyFeedback = document.getElementById('copy-feedback');

  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var shareData = {
        title: 'Boomer Tech Help',
        text: 'Simple, patient technology help for anyone who feels left behind by today\u2019s devices and apps.',
        url: SITE_CONFIG.siteUrl
      };

      if (navigator.share) {
        navigator.share(shareData).catch(function () {
          /* user cancelled or share failed silently; no action needed */
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SITE_CONFIG.siteUrl).then(function () {
          announceCopy();
        }).catch(function () {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    });
  }

  function fallbackCopy() {
    var temp = document.createElement('input');
    temp.value = SITE_CONFIG.siteUrl;
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand('copy'); announceCopy(); }
    catch (e) { if (copyFeedback) { copyFeedback.textContent = 'Copy this link: ' + SITE_CONFIG.siteUrl; } }
    document.body.removeChild(temp);
  }

  function announceCopy() {
    if (copyFeedback) {
      copyFeedback.textContent = 'Link copied \u2014 ready to paste and share.';
      window.clearTimeout(announceCopy._t);
      announceCopy._t = window.setTimeout(function () {
        copyFeedback.textContent = '';
      }, 5000);
    }
  }

  // ---- Restrained scroll reveal (skipped entirely for reduced motion) ----
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();

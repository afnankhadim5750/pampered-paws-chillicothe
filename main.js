// Pampered Paws Grooming Salon — menu, scroll-spy, FAQ, lightbox, booking form
(function () {
  'use strict';

  // Mobile menu: instant open/close (no transition, so it always lands open)
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Scroll-spy via IntersectionObserver
  var links = document.querySelectorAll('.main-nav .nav-link');
  var linkById = {};
  links.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#') linkById[id.slice(1)] = link;
  });
  function setActive(id) {
    links.forEach(function (link) { link.classList.remove('is-active'); });
    if (linkById[id]) linkById[id].classList.add('is-active');
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['home', 'about', 'services', 'gentle-care', 'gallery', 'visit', 'faq', 'book'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // FAQ accordion
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Gallery lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var current = 0;
  function show(index) {
    if (!items.length) return;
    current = (index + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.getAttribute('data-full');
    lbImg.alt = item.querySelector('img').alt;
    lbCap.textContent = item.getAttribute('data-caption') || '';
  }
  function openLb(index) {
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  items.forEach(function (item, i) {
    item.addEventListener('click', function () { openLb(i); });
  });
  var closeBtn = lightbox.querySelector('.lb-close');
  var prevBtn = lightbox.querySelector('.lb-prev');
  var nextBtn = lightbox.querySelector('.lb-next');
  if (closeBtn) closeBtn.addEventListener('click', closeLb);
  if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Booking form: drafts an email to the salon, nothing is sent by the site itself
  var form = document.getElementById('bookForm');
  var hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var dog = document.getElementById('fDog').value.trim();
      var service = document.getElementById('fService').value;
      var notes = document.getElementById('fNotes').value.trim();
      if (!name || !dog) {
        hint.textContent = 'Please add your name and your dog\u2019s name so the salon knows who is booking.';
        return;
      }
      var subject = 'Grooming booking enquiry — ' + dog;
      var body = 'Hi Megan,\n\nI would like to book a groom for my dog.\n\nMy name: ' + name + '\nDog\u2019s name: ' + dog + '\nService: ' + service +
        (notes ? '\nAnything to know: ' + notes : '') +
        '\n\nThank you!';
      window.location.href = 'mailto:pamperedpawsonwater@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      hint.textContent = 'Opening your email app with the booking details filled in…';
    });
  }
})();

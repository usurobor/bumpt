/* bump — shared screen behaviour: inject the mark, run the cohere animation,
   navigate between screens after a bump, and tick the counter. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MARK =
    '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle class="ring" cx="50" cy="50" r="34"></circle>' +
      '<circle class="pulse" cx="50" cy="50" r="34"></circle>' +
      '<path class="arc" d="M50 16 A34 34 0 1 1 49.99 16"></path>' +
      '<circle class="station" cx="50" cy="16" r="2.4"></circle>' +
      '<circle class="station" cx="79.4" cy="67" r="2.4"></circle>' +
      '<circle class="station" cx="20.6" cy="67" r="2.4"></circle>' +
    '</svg>';

  document.querySelectorAll('[data-mark]').forEach(function (h) { h.innerHTML = MARK; });

  function cohere(mark, cb) {
    if (!mark) { if (cb) cb(); return; }
    if (reduce) { if (cb) setTimeout(cb, 120); return; }
    mark.classList.remove('settle');
    mark.classList.add('cohering', 'pulsing');
    setTimeout(function () { mark.classList.add('settle'); }, 720);
    setTimeout(function () { mark.classList.remove('cohering', 'pulsing', 'settle'); }, 1400);
    if (cb) setTimeout(cb, 560);
  }

  // tap the mark / wordmark to watch it cohere
  document.querySelectorAll('[data-cohere-self]').forEach(function (h) {
    h.addEventListener('click', function () { cohere(h.querySelector('.mark')); });
  });

  // a bump that moves to another screen: cohere, then navigate
  document.querySelectorAll('[data-nav]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var href = el.getAttribute('data-nav');
      cohere(el.querySelector('.mark'), function () { window.location.href = href; });
    });
  });

  // cohere once on load (e.g. the thanks mark, when the knock lands)
  document.querySelectorAll('[data-cohere-load]').forEach(function (h) {
    setTimeout(function () { cohere(h.querySelector('.mark') || h); }, 280);
  });

  // count up to the target so the live count feels alive
  var c = document.querySelector('[data-counter]');
  if (c) {
    var target = parseInt(c.getAttribute('data-counter') || c.textContent.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(target)) {
      if (reduce) { c.textContent = target.toLocaleString('en-US'); }
      else {
        var from = Math.max(0, target - 8), cur = from, t0 = null;
        c.textContent = from.toLocaleString('en-US');
        requestAnimationFrame(function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 900);
          cur = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
          c.textContent = cur.toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(step);
        });
      }
    }
  }
})();

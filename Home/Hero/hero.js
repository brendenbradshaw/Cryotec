/* ============================================================
   CryoTec — Hero Final · tiny JS (no dependencies)
   Handles: notify dropdown toggle, mock submit, mobile trust rotator.
   Wire your real email-capture (Brevo, Mailchimp, etc.) inside
   the form 'submit' handler below.
============================================================ */
(function () {
  // — Notify dropdown —
  document.querySelectorAll('.mf-notify-btn').forEach(function (btn) {
    var section = btn.closest('.mf');
    if (!section) return;
    var panel  = section.querySelector('.mf-notify');
    var form   = section.querySelector('.mf-notify-form');
    var thanks = section.querySelector('.mf-notify-thanks');
    var closeBtn = section.querySelector('.mf-notify-close');

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        var input = panel.querySelector('.mf-notify-input');
        if (input) setTimeout(function () { input.focus(); }, 350);
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // === Wire your email-capture here ===
        // e.g. fetch('/your-brevo-endpoint', { method:'POST', body: new FormData(form) })
        //        .then(showThanks).catch(showThanks);
        showThanks();
      });
    }
    function showThanks() {
      if (form)   form.hidden = true;
      if (thanks) thanks.hidden = false;
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        panel.classList.remove('open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        if (form)   form.hidden = false;
        if (thanks) thanks.hidden = true;
      });
    }
  });

  // — Mobile trust rotator —
  document.querySelectorAll('.mf-trust-mobile').forEach(function (rotor) {
    var items = rotor.querySelectorAll('.mf-tb-m');
    if (items.length < 2) return;
    var i = 0;
    setInterval(function () {
      items[i].classList.remove('on');
      i = (i + 1) % items.length;
      items[i].classList.add('on');
    }, 2600);
  });
})();

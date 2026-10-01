// Same GoatCounter account as ITC; count only visits to the published TDD site.
(function () {
  if (window.location.hostname !== 'josepfontsegura.github.io' ||
      !/^\/tdd(?:\/|$)/.test(window.location.pathname)) return;

  var tracker = document.createElement('script');
  tracker.setAttribute('data-goatcounter', 'https://josepfontsegura.goatcounter.com/count');
  tracker.async = true;
  tracker.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(tracker);
})();

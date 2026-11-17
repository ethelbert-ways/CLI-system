/* Starts the app once every script has loaded. */
(function () {
  'use strict';
  function go() { if (window.CLI && CLI.start) CLI.start(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();

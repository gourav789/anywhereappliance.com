/* =========================================================
   Anywhere Appliance — Google Analytics (gtag.js)
   Measurement ID: G-YY2R7J469L
   Loaded once from every page via <script src=".../js/analytics.js">
   ========================================================= */
(function () {
  var GA_ID = 'G-YY2R7J469L';

  // Load the gtag.js library
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  // Initialise dataLayer + gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

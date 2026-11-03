/* global localStorage, document */
// Applies the saved theme before the page paints, so there is no flash of the wrong theme.
// A separate file (not inline) so a strict Content-Security-Policy can allow same-origin scripts only.
;(function () {
  var theme = 'light'
  try {
    var saved = localStorage.getItem('kodika-theme')
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch {
    // Storage can be unavailable (private mode, blocked site data); fall back to light.
  }
  document.documentElement.setAttribute('data-theme', theme)
})()

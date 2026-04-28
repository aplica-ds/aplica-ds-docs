// Runs on every page load in the browser (Docusaurus clientModule).
// Redirects to the appropriate locale once per session based on browser language.
// PT-BR is the default locale (no URL prefix); EN-US is at /en-US/.
export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;
  if (sessionStorage.getItem('aplica-lang-detected')) return;
  sessionStorage.setItem('aplica-lang-detected', '1');

  var lang = (navigator.language || '').toLowerCase();
  var isPortuguese = lang.startsWith('pt');
  var path = window.location.pathname;

  var atEnLocale = path.startsWith('/en-US') || path.startsWith('/en-us');

  if (!isPortuguese && !atEnLocale) {
    // Redirect to EN-US equivalent
    window.location.replace('/en-US' + path);
  } else if (isPortuguese && atEnLocale) {
    // Redirect to PT-BR (default locale — strip /en-US prefix)
    var ptPath = path.replace(/^\/en-US/i, '') || '/';
    window.location.replace(ptPath);
  }
}

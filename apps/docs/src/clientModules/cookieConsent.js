// Cookie consent banner for Docusaurus (LGPD/GDPR compliance).
// Runs on every route change; injects GA4 only after explicit user acceptance.
// Consent stored in localStorage['aplica-consent'] = { analytics: boolean, ts: ISO, v: '1' }

const GA_ID = 'G-VVFNS1CWQK';
const CONSENT_KEY = 'aplica-consent';
const BANNER_ID = 'aplica-cookie-banner-docs';
const STYLE_ID = 'aplica-cookie-banner-docs-style';

function isPt() {
  return !window.location.pathname.startsWith('/en-US');
}

function t(ptText, enText) {
  return isPt() ? ptText : enText;
}

function isDarkMode() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function loadGA() {
  if (window.__aplica_ga_loaded) return;
  window.__aplica_ga_loaded = true;
  // dataLayer and gtag must exist before the GA script runs
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
}

function saveConsent(analytics) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: analytics, ts: new Date().toISOString(), v: '1' }));
  } catch (e) {}
}

function removeBanner() {
  var el = document.getElementById(BANNER_ID);
  if (el) el.remove();
  var st = document.getElementById(STYLE_ID);
  if (st) st.remove();
}

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent =
    /* Desktop: floating card bottom-left */
    '#' + BANNER_ID + ' { display: flex; flex-direction: column; position: fixed; bottom: 1.5rem; left: 1.5rem; z-index: 9998; width: 380px; ' +
    'background: #111827; border: 1px solid #374151; border-radius: 1rem; padding: 1.25rem 1.5rem; gap: 1rem; ' +
    'box-shadow: 0 8px 40px rgba(0,0,0,0.45); }' +
    '[data-theme="dark"] #' + BANNER_ID + ' { background: #ffffff; border-color: #e5e7eb; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }' +
    '#' + BANNER_ID + ' .cb-content { display: flex; flex-direction: column; gap: 0.375rem; }' +
    '#' + BANNER_ID + ' .cb-title { font-weight: 600; font-size: 0.9375rem; margin: 0; color: #f9fafb; }' +
    '[data-theme="dark"] #' + BANNER_ID + ' .cb-title { color: #111827; }' +
    '#' + BANNER_ID + ' .cb-desc { font-size: 0.8125rem; line-height: 1.55; margin: 0; color: #9ca3af; }' +
    '[data-theme="dark"] #' + BANNER_ID + ' .cb-desc { color: #6b7280; }' +
    '#' + BANNER_ID + ' .cb-link { color: #f97316; text-decoration: underline; margin-left: 0.25rem; }' +
    '#' + BANNER_ID + ' .cb-actions { display: flex; gap: 0.625rem; }' +
    '#' + BANNER_ID + ' .cb-reject { flex: 1; padding: 0.5rem 1rem; border: 1px solid #4b5563; background: transparent; color: #9ca3af; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer; font-family: inherit; }' +
    '#' + BANNER_ID + ' .cb-reject:hover { border-color: #9ca3af; color: #f9fafb; }' +
    '[data-theme="dark"] #' + BANNER_ID + ' .cb-reject { border-color: #d1d5db; color: #6b7280; }' +
    '[data-theme="dark"] #' + BANNER_ID + ' .cb-reject:hover { border-color: #6b7280; color: #111827; }' +
    '#' + BANNER_ID + ' .cb-accept { flex: 2; padding: 0.5rem 1rem; background: #f97316; color: #ffffff; border: none; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; }' +
    '#' + BANNER_ID + ' .cb-accept:hover { opacity: 0.88; }' +
    /* Mobile: full-width bar at bottom */
    '@media (max-width: 600px) {' +
    '  #' + BANNER_ID + ' { bottom: 0; left: 0; right: 0; width: auto; border-radius: 0; border-left: none; border-right: none; border-bottom: none; padding: 1rem 1rem 1.25rem; box-shadow: 0 -4px 32px rgba(0,0,0,0.3); }' +
    '}';
  document.head.appendChild(style);
}

function injectBanner() {
  if (document.getElementById(BANNER_ID)) return;

  injectStyles();

  var privacyHref = t('/privacy', '/en/privacy');
  var privacyLabel = t('Política de Privacidade', 'Privacy Policy');

  var banner = document.createElement('div');
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-label', t('Aviso de cookies', 'Cookie notice'));

  banner.innerHTML =
    '<div class="cb-content">' +
      '<p class="cb-title">' + t('Este site usa cookies', 'This site uses cookies') + '</p>' +
      '<p class="cb-desc">' +
        t(
          'Usamos o Google Analytics para entender como o site é usado e melhorar a experiência. Cookies funcionais (tema, idioma) são sempre ativos.',
          'We use Google Analytics to understand how the site is used and improve the experience. Functional cookies (theme, language) are always active.'
        ) +
        ' <a href="' + privacyHref + '" class="cb-link">' + privacyLabel + '</a>.' +
      '</p>' +
    '</div>' +
    '<div class="cb-actions">' +
      '<button id="aplica-docs-reject" class="cb-reject">' + t('Rejeitar', 'Reject') + '</button>' +
      '<button id="aplica-docs-accept" class="cb-accept">' + t('Aceitar analytics', 'Accept analytics') + '</button>' +
    '</div>';

  document.body.appendChild(banner);

  document.getElementById('aplica-docs-accept').addEventListener('click', function () {
    saveConsent(true);
    loadGA();
    removeBanner();
  });

  document.getElementById('aplica-docs-reject').addEventListener('click', function () {
    saveConsent(false);
    removeBanner();
  });
}

export function onRouteDidUpdate() {
  try {
    var stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    if (!stored) {
      injectBanner();
    } else if (stored.analytics === true) {
      loadGA();
    }
  } catch (e) {
    injectBanner();
  }
}

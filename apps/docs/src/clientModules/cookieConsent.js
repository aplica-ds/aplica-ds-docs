// Cookie consent banner for Docusaurus (LGPD/GDPR compliance).
// Runs on every route change; injects GA4 only after explicit user acceptance.
// Consent stored in localStorage['aplica-consent'] = { analytics: boolean, ts: ISO, v: '1' }

const GA_ID = 'G-VVFNS1CWQK';
const CONSENT_KEY = 'aplica-consent';
const BANNER_ID = 'aplica-cookie-banner-docs';

function isPt() {
  return !window.location.pathname.startsWith('/en-US');
}

function t(ptText, enText) {
  return isPt() ? ptText : enText;
}

function loadGA() {
  if (window.__aplica_ga_loaded) return;
  window.__aplica_ga_loaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  s.onload = function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  };
}

function saveConsent(analytics) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: analytics, ts: new Date().toISOString(), v: '1' }));
  } catch (e) {}
}

function removeBanner() {
  var el = document.getElementById(BANNER_ID);
  if (el) el.remove();
}

function injectBanner() {
  if (document.getElementById(BANNER_ID)) return;

  var banner = document.createElement('div');
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-label', t('Aviso de cookies', 'Cookie notice'));

  var privacyHref = t('/privacy', '/en/privacy');
  var privacyLabel = t('Política de Privacidade', 'Privacy Policy');

  banner.innerHTML =
    '<div style="flex:1;min-width:0;">' +
      '<p style="font-weight:600;font-size:0.9375rem;color:var(--ifm-font-color-base);margin-bottom:0.25rem;">' +
        t('Este site usa cookies', 'This site uses cookies') +
      '</p>' +
      '<p style="font-size:0.8125rem;color:var(--ifm-color-emphasis-600);line-height:1.5;margin:0;">' +
        t(
          'Usamos o Google Analytics para entender como o site é usado e melhorar a experiência. Cookies funcionais (tema, idioma) são sempre ativos.',
          'We use Google Analytics to understand how the site is used and improve the experience. Functional cookies (theme, language) are always active.'
        ) +
        ' <a href="' + privacyHref + '" style="color:var(--ifm-color-primary);text-decoration:underline;margin-left:0.25rem;">' + privacyLabel + '</a>.' +
      '</p>' +
    '</div>' +
    '<div style="display:flex;gap:0.75rem;flex-shrink:0;flex-wrap:wrap;">' +
      '<button id="aplica-docs-reject" style="padding:0.5rem 1rem;border:1px solid var(--ifm-color-emphasis-300);background:transparent;color:var(--ifm-color-emphasis-600);border-radius:0.5rem;font-size:0.875rem;cursor:pointer;font-family:inherit;">' +
        t('Rejeitar', 'Reject') +
      '</button>' +
      '<button id="aplica-docs-accept" style="padding:0.5rem 1rem;background:var(--ifm-color-primary);color:#ffffff;border:none;border-radius:0.5rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">' +
        t('Aceitar analytics', 'Accept analytics') +
      '</button>' +
    '</div>';

  banner.style.cssText =
    'display:flex;position:fixed;bottom:0;left:0;right:0;z-index:9998;' +
    'background:var(--ifm-background-color);' +
    'border-top:1px solid var(--ifm-color-emphasis-200);' +
    'padding:1rem 1.5rem;' +
    'box-shadow:0 -4px 24px rgba(0,0,0,0.08);' +
    'align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;';

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


(() => {
  const MODAL_ID = 'yt-confirm-modal';
  const BTN_CLASS = 'yt-confirm-btn';

  function getBash() {
    const params = new URLSearchParams(location.search);
    if (!params.has('bash')) return null;
    try {
      return decodeURIComponent(params.get('bash'));
    } catch {
      return params.get('bash');
    }
  }

  function isValidUrl(url) {
    try { new URL(url); return true; } catch { return false; }
  }

  const bashUrl = getBash();

  // ❌ TANPA ?bash= → HAPUS tombol dari DOM (bukan CSS)
  if (!bashUrl || !isValidUrl(bashUrl)) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.' + BTN_CLASS).forEach(btn => btn.remove());
    });
    return;
  }

  function ensureModal() {
    let backdrop = document.getElementById(MODAL_ID);
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = MODAL_ID;
    backdrop.className = 'yt-modal-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = `
      <div role="dialog" class="yt-modal">
        <h3>Leaving this site</h3>
        <p>You are about to visit an external link. Do you want to continue?</p>
        <div class="yt-actions">
          <button class="yt-bbatal" data-action="cancel">Cancel</button>
          <button class="yt-nnext" data-action="next">Continue</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  let currentURL = null;

  document.addEventListener('click', e => {
    const btn = e.target.closest('.' + BTN_CLASS);
    if (!btn) return;

    e.preventDefault();
    currentURL = bashUrl;
    ensureModal().setAttribute('aria-hidden', 'false');
  });

  document.addEventListener('click', e => {
    if (!e.target.dataset.action) return;

    const backdrop = document.getElementById(MODAL_ID);
    if (!backdrop) return;

    if (e.target.dataset.action === 'next' && currentURL) {
      window.open(currentURL, '_blank', 'noopener');
    }

    backdrop.setAttribute('aria-hidden', 'true');
    currentURL = null;
  });
})();

(() => {
  const MODAL_ID = 'yt-confirm-modal';

  function findBashCandidate() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('bash')) return params.get('bash');
    for (const [k, v] of params.entries()) {
      if (k.toLowerCase().includes('bash') && v) return v;
    }
    return null;
  }

  function isValidUrl(s) {
    try { new URL(s); return true; } catch { return false; }
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
        <h3>Menuju tautan eksternal</h3>
        <p>Kamu akan meninggalkan situs ini. Lanjutkan?</p>
        <div class="yt-actions">
          <button class="yt-bbatal" data-action="cancel">Batal</button>
          <button class="yt-nnext" data-action="next">Lanjut</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  let currentURL = null;

  document.addEventListener('click', e => {
    const btn = e.target.closest('.yt-confirm-btn');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url;
    if (!isValidUrl(url)) return;

    ensureModal().setAttribute('aria-hidden', 'false');
    currentURL = url;
  });

  document.addEventListener('click', e => {
    if (e.target.dataset.action === 'next' && currentURL) {
      window.open(currentURL, '_blank', 'noopener');
    }
    if (e.target.dataset.action) {
      document.getElementById(MODAL_ID).setAttribute('aria-hidden', 'true');
    }
  });
})();

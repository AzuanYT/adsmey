(() => {
  const MODAL_ID = 'yt-confirm-modal';

  // === ambil parameter ?bash= ===
  function findBashCandidate() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('bash')) {
      try {
        return decodeURIComponent(params.get('bash'));
      } catch {
        return params.get('bash');
      }
    }

    for (const [k, v] of params.entries()) {
      if (k.toLowerCase().includes('bash') && v) {
        try {
          return decodeURIComponent(v);
        } catch {
          return v;
        }
      }
    }
    return null;
  }

  function isValidUrl(s) {
    try { new URL(s); return true; } catch { return false; }
  }

  // === modal ===
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

  // === klik tombol download ===
  document.addEventListener('click', e => {
    const btn = e.target.closest('.yt-confirm-btn');
    if (!btn) return;

    e.preventDefault();

    const bashUrl = findBashCandidate();
    const finalUrl =
      bashUrl && isValidUrl(bashUrl)
        ? bashUrl
        : btn.dataset.url;

    if (!isValidUrl(finalUrl)) {
      console.warn('URL tidak valid');
      return;
    }

    currentURL = finalUrl;
    ensureModal().setAttribute('aria-hidden', 'false');
  });

  // === aksi modal ===
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

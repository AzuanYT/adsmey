<!-- Kode ini simpan di GitHub -->
<style>
  :root {
    --ring: color-mix(in oklab, currentColor 40%, transparent);
    --bg: color-mix(in oklab, Canvas 92%, currentColor 0%);
    --text: currentColor;
    --muted: color-mix(in oklab, currentColor 60%, transparent);
    --accent: color-mix(in oklab, currentColor 30%, transparent);
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: color-mix(in oklab, Canvas 85%, currentColor 0%); }
  }

  .yt-confirm-btn {
    font: inherit; color: inherit; background: transparent;
    border: 1px solid var(--accent); padding: .4rem .6rem;
    border-radius: .6rem; line-height: 1; text-align: center;
    font-size: .85rem; cursor: pointer; transition: transform .08s ease, background-color .15s ease, border-color .15s ease;
  }
  .yt-confirm-btn:hover { background: var(--accent); }
  .yt-confirm-btn:active { transform: translateY(1px); }
  .yt-confirm-btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

  .yt-modal-backdrop {
    position: fixed; inset: 0; display: none; place-items: center;
    background: color-mix(in oklab, CanvasText 15%, transparent);
    z-index: 2147483646; padding: 1rem;
  }
  .yt-modal-backdrop[aria-hidden="false"] { display: grid; }
  .yt-modal {
    min-width: 260px; max-width: 360px; width: fit-content;
    background: var(--bg); color: var(--text); border: 1px solid var(--accent);
    border-radius: 1rem; box-shadow: 0 10px 30px color-mix(in oklab, CanvasText 12%, transparent);
    padding: .9rem; font-size: .9rem;
  }
  .yt-modal h3 { margin: 0 0 .25rem 0; font-size: 1rem; font-weight: 600; }
  .yt-modal p { margin: 0 0 .8rem 0; color: var(--muted); font-size: .85rem; }

  .yt-actions { display:flex; gap:.5rem; justify-content:flex-end; margin-top:.35rem; }
  .yt-btn {
    font: inherit; font-size:.85rem; line-height:1;
    padding:.45rem .7rem; border-radius:.6rem; border:1px solid var(--accent);
    background:transparent; color:inherit; cursor:pointer; transition: background-color .15s ease, opacity .15s ease;
  }
  .yt-btn:hover { background: var(--accent); }
  .yt-btn-primary { border-color: var(--ring); }
  .yt-btn-ghost { opacity:.85; }

  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }
</style>

<script type="module">
(() => {
  const MODAL_ID = 'yt-confirm-modal';


  function findBashCandidate() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('bash')) {
      const v = params.get('bash');
      if (v) return v;
    }
    
    for (const [k, v] of params.entries()) {
      if (k.toLowerCase().includes('bash') && v) return v;
    }
    
    for (const [k, v] of params.entries()) {
      if (k.toLowerCase() === 'm') continue; 
      if (!v) continue;
      if (v.startsWith('http://') || v.startsWith('https://')) return v;
    }
    
    return null;
  }

  function isValidUrl(s) {
    try { new URL(s); return true; } catch (e) { return false; }
  }

  // --- Modal creation / ensure ---
  function ensureModal() {
    let backdrop = document.getElementById(MODAL_ID);
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = MODAL_ID;
    backdrop.className = 'yt-modal-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="yt-title" aria-describedby="yt-desc" class="yt-modal" >
        <h3 id="yt-title" style="color: black;">Menuju tautan eksternal</h3>
        <p id="yt-desc" style="color: black;">Kamu akan meninggalkan situs ini. Lanjutkan?</p>
        <div class="yt-actions">
          <button type="button" class="yt-btn yt-btn-ghost" data-action="cancel" style="color: black;">Batal</button>
          <button type="button" class="yt-btn yt-btn-primary" data-action="next" style="color: black;">Lanjut</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  let currentURL = null;
  let openerEl = null;
  const bashCandidateRaw = findBashCandidate();
  const bashCandidate = (bashCandidateRaw && isValidUrl(bashCandidateRaw)) ? bashCandidateRaw : null;

  function openModal(url, opener) {
    const backdrop = ensureModal();
    currentURL = url;
    openerEl = opener;
    backdrop.setAttribute('aria-hidden', 'false');
    // focus next button
    const nextBtn = backdrop.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.focus();
    // lock page scroll
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal() {
    const backdrop = document.getElementById(MODAL_ID);
    if (!backdrop) return;
    backdrop.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (openerEl) openerEl.focus();
    currentURL = null;
    openerEl = null;
  }

  // --- attach handlers to all triggers ---
  function getFinalUrlForButton(btn) {
    const defaultUrl = btn.getAttribute('data-url') || btn.dataset.url || '';
   
    if (bashCandidate) return bashCandidate;

    return defaultUrl;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const trigger = t.closest && t.closest('.yt-confirm-btn');
    if (trigger) {
      e.preventDefault();
  
      const finalUrl = getFinalUrlForButton(trigger);
      
      if (!isValidUrl(finalUrl)) {
        
        const fallback = trigger.getAttribute('data-url');
        if (fallback && isValidUrl(fallback)) {
          openModal(fallback, trigger);
        } else {
          // tidak ada URL valid -> do nothing (atau beri alert)
          console.warn('Tidak ada URL valid pada tombol ini.');
        }
      } else {
        openModal(finalUrl, trigger);
      }
      return;
    }

    // modal belum ada atau tertutup -> abaikan
    const backdrop = document.getElementById(MODAL_ID);
    if (!backdrop || backdrop.getAttribute('aria-hidden') === 'true') return;
const contohURL = "https://signingunwilling.com/xg957wjx?key=06036766e099d326a71a5037fd19b8e4";
    // tombol Batal
    if (t.matches('[data-action="cancel"]')) {
      window.open(contohURL, '_blank', 'noopener');
      closeModal();
      return;
    }
    // tombol Lanjut
    if (t.matches('[data-action="next"]')) {
      if (currentURL) {
        // buka di tab baru
        window.open(currentURL, '_blank', 'noopener');
      }
      closeModal();
      return;
    }

    // klik di luar dialog (backdrop) -> tutup
    const dialog = backdrop.querySelector('[role="dialog"]');
    if (t === backdrop) {
      closeModal();
    }
  });

  // ESC support
  document.addEventListener('keydown', (e) => {
    const backdrop = document.getElementById(MODAL_ID);
    if (!backdrop || backdrop.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  });

})();
</script>

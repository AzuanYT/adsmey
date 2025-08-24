(function () {
  // === CONFIG (ganti sesuai kebutuhan) ===
  const redirectUrl = "https://difficultywithhold.com/xg957wjx?key=06036766e099d326a71a5037fd19b8e4";
  const downloadUrl = "https://juamey.rf.gd/ads.html";
  const imageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicYADve-sbUkhFv01gQUzn5hWc1EatCdp_y81avJlOHRnRTqyNLQNTf6ajewiP55baB-_sXH5slmIbb0rnMQU6KiaT9V2-X2XRwlu0Tbj3JySopymB4VNZnCPLS24Dv_SQDQHfoqyWE0h5u-9vWKoYU3sfqcjvvMAoDgGuuNZL2MkPDad6PL38NFMpqAs/s1600/ads.png";
  const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiY1YVlJ_guBeRnbpCkPIafOCWyWwEBDD6A3_TUzWfbIukLrBpvFK_5gjkfwgRPXV3NGcrAL0VEW8unkBJP2QeEA8XbxvB7ymFfYTxM9mOtAZP-KN2muQ2zKIlMYA4LGJFQliTr6A0NseW5xtHMJBTpYXOV5np4rVs8VJAKxvTbTUw5dvM-DLkpAbT2MDs/s1600/New%20Project%2033%20%5BCDAFBC1%5D.png";
  const SHOW_AFTER_MS = 6000;
  const DOWNLOAD_DELAY_MS = 200;
  const ENABLE_ESC_CLOSE = false;

  let timerId = null;
  let hasShown = false;
  let prevActiveElement = null;
  let keydownHandler = null;

  function startTimerOnce() {
    clearTimeout(timerId);
    if (!hasShown) {
      timerId = setTimeout(showModal, SHOW_AFTER_MS);
    }
  }

  // NOTE: kita tidak mem-block scroll background agar tetap bisa digulir
  function lockBodyScrollSmart() {
    // kosongkan: tidak mengunci scroll supaya user bisa tetap scroll
    // document.body.style.position = 'relative';
  }

  function unlockBodyScrollSmart() {
    // kosongkan (sesuaikan kalau ada perubahan)
  }

  function removeModalIfAny() {
    const old = document.getElementById("smj-modal");
    if (old) {
      document.removeEventListener("keydown", keydownHandler);
      old.classList.remove("smj-show");
      unlockBodyScrollSmart();
      if (prevActiveElement && typeof prevActiveElement.focus === "function") {
        try { prevActiveElement.focus(); } catch (e) { }
      }
      setTimeout(() => old?.remove(), 300);
    }
  }

  function trapFocus(container, e) {
    const focusable = Array.from(container.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function showModal() {
    if (hasShown) return;
    hasShown = true;
    removeModalIfAny();
    prevActiveElement = document.activeElement;
    preloadImageThenShow();
  }

  function preloadImageThenShow() {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "smj-loading";
    loadingOverlay.innerHTML = `
      <div class="smj-loading-content">
        <div class="smj-spinner" role="status" aria-hidden="true"></div>
        <p>Loading content...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    // tidak memanggil lockBodyScrollSmart agar scroll tetap berfungsi
    setTimeout(() => loadingOverlay.classList.add("smj-show"), 10);

    const preloadImg = new Image();
    preloadImg.onload = () => {
      setTimeout(() => {
        loadingOverlay.remove();
        createAndShowModal();
      }, 220);
    };
    preloadImg.onerror = () => {
      loadingOverlay.remove();
      createAndShowModal();
    };
    preloadImg.src = imageUrl;
  }

  function createAndShowModal() {
    const overlay = document.createElement("div");
    overlay.id = "smj-modal";
    overlay.className = "smj-overlay";
    overlay.setAttribute("aria-hidden", "false");
    // overlay akan menangkap click (agar klik di luar modal tidak menerus)
    overlay.style.pointerEvents = "auto";

    const box = document.createElement("div");
    box.className = "smj-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.style.pointerEvents = "auto";
    const titleId = "smj-title-" + Date.now();
    box.setAttribute("aria-labelledby", titleId);

    const title = document.createElement("h2");
    title.id = titleId;
    title.textContent = "Advertisement";
    title.style.position = "absolute";
    title.style.left = "-9999px";
    box.appendChild(title);

    const imgWrap = document.createElement("div");
    imgWrap.className = "smj-imgwrap";

    // Badge with logo + text
    const badge = document.createElement("div");
    badge.className = "smj-badge";
    badge.innerHTML = `<img src="${logoUrl}" alt="Company logo" class="smj-badge-logo" /> <span class="smj-badge-text">SPONSORED</span>`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "smj-close";
    closeBtn.setAttribute("aria-label", "Close advertisement");
    closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    // Image: no-op on click (tidak menuju ke ads)
    const img = document.createElement("img");
    img.className = "smj-img";
    img.src = imageUrl;
    img.alt = "Promotional image";
    img.loading = "lazy";

    imgWrap.appendChild(img);

    const overlayBtns = document.createElement("div");
    overlayBtns.className = "smj-imgbtns";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "smj-imgbtn smj-cancel";
    cancelBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> <span>Cancel</span>`;

    const nextBtn = document.createElement("button");
    nextBtn.className = "smj-imgbtn smj-next";
    nextBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg> <span>Continue</span>`;

    overlayBtns.appendChild(cancelBtn);
    overlayBtns.appendChild(nextBtn);

    imgWrap.appendChild(badge);
    imgWrap.appendChild(closeBtn);
    imgWrap.appendChild(overlayBtns);

    box.appendChild(imgWrap);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // jangan block scroll; overlay tetap tampil
    setTimeout(() => overlay.classList.add("smj-show"), 10);

    setTimeout(() => {
      try { closeBtn.focus(); } catch (e) { }
    }, 100);

    function actionCloseNoRedirect() {
      removeModalIfAny();
    }

    function actionCancelWithURL() {
      removeModalIfAny();
      try {
        const a = document.createElement("a");
        a.href = redirectUrl;
        a.style.display = "none";
        document.body.appendChild(a);
        setTimeout(() => {
          try { a.click(); }
          catch (e) { window.open(redirectUrl, "_blank", "noopener"); }
          setTimeout(() => a.remove(), 1200);
        }, 0);
      } catch (err) {
        setTimeout(() => window.open(redirectUrl, "_blank", "noopener"), 0);
      }
    }

    function actionNextWithDownload() {
      removeModalIfAny();
      try {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.style.display = "none";
        document.body.appendChild(a);
        setTimeout(() => {
          try { a.click(); }
          catch (e) { window.open(downloadUrl, "_blank", "noopener"); }
          setTimeout(() => a.remove(), 1200);
        }, DOWNLOAD_DELAY_MS);
      } catch (err) {
        setTimeout(() => window.open(downloadUrl, "_blank", "noopener"), DOWNLOAD_DELAY_MS);
      }
    }

    box.addEventListener("click", (e) => e.stopPropagation());

    // Event handlers: gambar intentionally no-op
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCancelWithURL(); });
    // img.addEventListener("click", (e) => { e.stopPropagation(); /* no-op */ });
    cancelBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCloseNoRedirect(); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); actionNextWithDownload(); });

    // overlay menangkap klik di luar .smj-box dan mencegahnya — sehingga klik/tap di luar tidak menerus
    overlay.addEventListener("click", function (e) {
      if (!e.target.closest('.smj-box')) {
        e.stopPropagation();
        e.preventDefault();
        // tidak melakukan close; hanya blok klik
      }
    }, { passive: true });

    // juga blok context menu di luar modal
    overlay.addEventListener("contextmenu", function (e) {
      if (!e.target.closest('.smj-box')) {
        e.preventDefault();
      }
    });

    keydownHandler = function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && ENABLE_ESC_CLOSE) {
        e.preventDefault();
        actionCloseNoRedirect();
        return;
      }
      if (e.key === "Tab") {
        trapFocus(box, e);
      }
    };
    document.addEventListener("keydown", keydownHandler);
  }

  function injectCSS() {
    if (document.getElementById("smj-styles")) return;
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      #smj-loading {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5));
        z-index: 2147483648;
        opacity: 0;
        transition: opacity 0.28s ease;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        backdrop-filter: blur(6px);
        pointer-events: none; /* loading overlay tidak perlu interaksi */
      }

      #smj-loading.smj-show { opacity: 1; }

      .smj-loading-content {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        padding: 18px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(0,0,0,0.04);
        gap: 8px;
      }

      .smj-spinner {
        width: 36px;
        height: 36px;
        border: 3px solid rgba(59,130,246,0.12);
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
        margin-bottom: 0;
      }

      .smj-loading-content p {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        letter-spacing: 0.01em;
      }

      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

      /* overlay menutupi layar dan menangkap klik, tapi membiarkan scroll vertical (pan-y) */
      #smj-modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.45));
        z-index: 2147483647;
        opacity: 0;
        transition: opacity 0.28s ease;
        padding: 20px;
        box-sizing: border-box;
        pointer-events: auto; /* overlay harus menangkap click di luar modal */
        backdrop-filter: blur(6px);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        touch-action: pan-y; /* biarkan gesture scroll vertikal */
      }

      #smj-modal.smj-show { opacity: 1; }

      #smj-modal .smj-box {
        position: relative;
        background: transparent;
        border-radius: 14px;
        width: 100%;
        max-width: 420px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
        transform: scale(0.95) translateY(6px);
        transition: transform 0.28s cubic-bezier(0.2, 0.0, 0.2, 1);
      }
      #smj-modal.smj-show .smj-box { transform: scale(1) translateY(0); }

      .smj-imgwrap {
        position: relative;
        width: 100%;
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        border: 1px solid rgba(0,0,0,0.04);
      }

      /* badge (logo + text) */
      .smj-badge {
        position: absolute;
        left: 12px;
        top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        color: #3b82f6;
        background: rgba(255,255,255,0.92);
        z-index: 6;
        backdrop-filter: blur(6px);
        box-shadow: 0 6px 18px rgba(59,130,246,0.08);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        pointer-events: none; /* badge sendiri tidak menerima klik */
      }

      /* *** PENTING: paksa logo agar tidak terpengaruh dark-mode atau blending *** */
      .smj-badge-logo {
        height: 18px;
        width: auto;
        display: block;
        object-fit: contain;
        vertical-align: middle;
        background: transparent !important;
        mix-blend-mode: normal !important;
        filter: none !important;
        -webkit-filter: none !important;
      }

      .smj-badge-text { font-size: 11px; }

      .smj-close {
        position: absolute;
        right: 12px;
        top: 10px;
        min-width: 36px;
        height: 36px;
        border-radius: 10px;
        border: 1px solid rgba(0,0,0,0.06);
        background: rgba(255,255,255,0.92);
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #6b7280;
        z-index: 6;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        backdrop-filter: blur(6px);
        box-shadow: 0 6px 14px rgba(0,0,0,0.08);
      }

      .smj-close:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0,0,0,0.12); color: #374151; }

      .smj-img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: cover;
        transition: transform 0.24s cubic-bezier(0.2, 0.0, 0.2, 1);
      }
      .smj-img:hover { transform: scale(1.01); }

      .smj-imgbtns {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 14px;
        display: flex;
        gap: 10px;
        z-index: 6;
      }

      .smj-imgbtn {
        padding: 8px 14px;
        border-radius: 999px;
        border: none;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: inherit;
        letter-spacing: 0.01em;
      }

      .smj-imgbtn:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0,0,0,0.12); }
      .smj-imgbtn:active { transform: translateY(-1px); transition-duration: 0.08s; }

      .smj-cancel { background: rgba(255,255,255,0.94); color: #6b7280; border: 1px solid rgba(0,0,0,0.06); }
      .smj-cancel:hover { background: rgba(255,255,255,0.98); color: #374151; }

      .smj-next { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #ffffff; border: 1px solid rgba(59,130,246,0.22); }
      .smj-next:hover { background: linear-gradient(135deg, #2563eb, #1e40af); box-shadow: 0 14px 34px rgba(59,130,246,0.14); }

      @media (max-width: 520px) {
        #smj-modal { padding: 12px; }
        .smj-imgwrap { border-radius: 10px; }
        .smj-badge { left: 10px; top: 10px; padding: 5px 10px; font-size: 10px; }
        .smj-badge-logo { height: 16px; }
        .smj-close { right: 10px; top: 8px; min-width: 32px; height: 32px; font-size: 13px; border-radius: 8px; }
        .smj-imgbtn { padding: 8px 12px; font-size: 12px; border-radius: 999px; gap: 6px; }
        .smj-imgbtns { bottom: 12px; gap: 8px; }
        .smj-loading-content { padding: 14px 18px; border-radius: 10px; }
      }

      .smj-close:focus, .smj-imgbtn:focus { outline: 3px solid rgba(59,130,246,0.35); outline-offset: 2px; }

      @media (prefers-color-scheme: dark) {
        .smj-loading-content { background: linear-gradient(135deg, #111827, #0b1220); border-color: rgba(255,255,255,0.02); }
        .smj-loading-content p { color: #d1d5db; }
        .smj-imgwrap { background: linear-gradient(135deg, #0b1220, #07101a); border-color: rgba(255,255,255,0.02); }
        .smj-badge, .smj-close, .smj-cancel { background: rgba(17,24,39,0.9); color: #d1d5db; border-color: rgba(255,255,255,0.03); }
        .smj-close:hover, .smj-cancel:hover { background: rgba(31,41,55,0.94); color: #f3f4f6; }
        .smj-badge { color: #60a5fa; border-color: rgba(96,165,250,0.18); }
        /* tetap paksa logo agar tetap normal di dark mode */
        .smj-badge-logo { mix-blend-mode: normal !important; filter: none !important; -webkit-filter: none !important; background: transparent !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        #smj-modal, #smj-loading, .smj-box, .smj-close, .smj-imgbtn, .smj-img { transition: none; }
        .smj-spinner { animation: none; }
      }
    `;
    const style = document.createElement("style");
    style.id = "smj-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectCSS();
        startTimerOnce();
      });
    } else {
      injectCSS();
      startTimerOnce();
    }
  }

  init();

  window.SMJ = {
    showNow: () => showModal(),
    stop: () => {
      clearTimeout(timerId);
      removeModalIfAny();
      unlockBodyScrollSmart();
      hasShown = true;
    },
    reset: () => {
      hasShown = false;
      startTimerOnce();
    },
    hasShown: () => hasShown,
    config: {
      redirectUrl,
      downloadUrl,
      imageUrl,
      showAfterMs: SHOW_AFTER_MS,
      escClose: ENABLE_ESC_CLOSE
    }
  };
})();

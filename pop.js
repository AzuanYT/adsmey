(function () {
  // === CONFIG (ganti sesuai kebutuhan) ===
  const redirectUrl = "https://difficultywithhold.com/h586bnnp?key=7522ac450e62fd68f15c09256ec77068";
  const downloadUrl = "https://discord.gg/9bHCNqCEDq"; // tetap disimpan kalau mau dipakai lagi
  const imageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNkEskVIPPgDZBjnfQTMsDnh1RBcmmtGs-dL9zrDMADrGStZ9vN5RyJ78vYrO4_rvbbpwQba8KsFwRInkH9diY-hL9KeVFFDnxSklTzvhyh0v6zLtiGFqbcBbry3LWFYkhgeC8WOHBeAB2FAin7lPVZ45NTp7B_D7XlYgPhZvYV8GnWff3Vx4cDqrPl7o/s1600/NewProject47620E9D8-ezgif.com-video-to-webp-converter.webp";
  const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiY1YVlJ_guBeRnbpCkPIafOCWyWwEBDD6A3_TUzWfbIukLrBpvFK_5gjkfwgRPXV3NGcrAL0VEW8unkBJP2QeEA8XbxvB7ymFfYTxM9mOtAZP-KN2muQ2zKIlMYA4LGJFQliTr6A0NseW5xtHMJBTpYXOV5np4rVs8VJAKxvTbTUw5dvM-DLkpAbT2MDs/s1600/New%20Project%2033%20%5BCDAFBC1%5D.png";
  const SHOW_AFTER_MS = 6000;
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

  function lockBodyScrollSmart() {
    // intentionally empty: don't block scrolling
  }

  function unlockBodyScrollSmart() {
    // intentionally empty
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
      setTimeout(() => old?.remove(), 350);
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
        <div class="smj-loading-spinner">
          <div class="smj-loading-dot"></div>
          <div class="smj-loading-dot"></div>
          <div class="smj-loading-dot"></div>
        </div>
        <p class="smj-loading-text">Loading content...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.classList.add("smj-show"), 50);

    const preloadImg = new Image();
    const preloadLogo = new Image();

    let loadedCount = 0;
    const totalImages = 2;

    function checkAllLoaded() {
      loadedCount++;
      if (loadedCount === totalImages) {
        setTimeout(() => {
          loadingOverlay.remove();
          createAndShowModal();
        }, 300);
      }
    }

    preloadImg.onload = checkAllLoaded;
    preloadImg.onerror = checkAllLoaded;
    preloadImg.src = imageUrl;

    preloadLogo.onload = checkAllLoaded;
    preloadLogo.onerror = checkAllLoaded;
    preloadLogo.src = logoUrl;
  }

  function createAndShowModal() {
    const overlay = document.createElement("div");
    overlay.id = "smj-modal";
    overlay.className = "smj-overlay";
    overlay.setAttribute("aria-hidden", "false");
    overlay.style.pointerEvents = "auto";

    const box = document.createElement("div");
    box.className = "smj-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");

    const titleId = "smj-title-" + Date.now();
    box.setAttribute("aria-labelledby", titleId);
    const title = document.createElement("h2");
    title.id = titleId;
    title.textContent = "Advertisement";
    title.style.position = "absolute";
    title.style.left = "-9999px";
    box.appendChild(title);

    const modalCard = document.createElement("div");
    modalCard.className = "smj-modal-card";

    // HEADER WITH LOGO AND CLOSE BUTTON
    const header = document.createElement("div");
    header.className = "smj-header";

    const logo = document.createElement("img");
    logo.className = "smj-logo";
    logo.src = logoUrl;
    logo.alt = "Brand Logo";
    logo.loading = "lazy";

    const closeBtn = document.createElement("button");
    closeBtn.className = "smj-close-btn";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    `;

    header.appendChild(logo);
    header.appendChild(closeBtn);

    // MAIN CONTENT IMAGE (contentArea position:relative for overlay button)
    const contentArea = document.createElement("div");
    contentArea.className = "smj-content";

    const img = document.createElement("img");
    img.className = "smj-main-img";
    img.src = imageUrl;
    img.alt = "Promotional content";
    img.loading = "lazy";

    contentArea.appendChild(img);

    // JOIN DISCORD BUTTON - overlay inside bottom of image
    const joinBtn = document.createElement("button");
    joinBtn.className = "smj-join-btn";
    joinBtn.type = "button";
    joinBtn.setAttribute("aria-label", "Join Discord (opens in new tab)");
    joinBtn.innerHTML = `
      
      
      
 <span class="smj-join-text">JOIN DISCORD</span>
    `;
    contentArea.appendChild(joinBtn);

    // FOOTER: thin decorative div (3px)
    const footer = document.createElement("div");
    footer.className = "smj-footer";

    // ASSEMBLE MODAL
    modalCard.appendChild(header);
    modalCard.appendChild(contentArea);
    modalCard.appendChild(footer);
    box.appendChild(modalCard);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // show animation
    setTimeout(() => overlay.classList.add("smj-show"), 50);

    // focus join button
    setTimeout(() => {
      try { joinBtn.focus(); } catch (e) { }
    }, 150);

    // Actions
    function actionCloseNoRedirect() {
      removeModalIfAny();
    }

    function actionJoinRedirect() {
      // open in new tab and close modal
      try {
        const win = window.open(redirectUrl, "_blank", "noopener");
        if (!win) {
          // popup blocked -> fallback to same tab
          window.location.href = redirectUrl;
        }
      } catch (e) {
        window.location.href = redirectUrl;
      }
      removeModalIfAny();
    }

    // button wiring
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCloseNoRedirect(); });
    joinBtn.addEventListener("click", (e) => { e.stopPropagation(); actionJoinRedirect(); });

    // prevent clicking outside to close (keeps user focused on modal)
    overlay.addEventListener("click", function (e) {
      if (!e.target.closest('.smj-box')) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, { passive: false });

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

      /* Reset */
      #smj-modal *, #smj-loading * { box-sizing: border-box; }

      /* Loading Overlay */
      #smj-loading {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.75);
        z-index: 2147483648;
        opacity: 0;
        transition: opacity 0.3s;
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        backdrop-filter: blur(8px);
        pointer-events: none;
      }
      #smj-loading.smj-show { opacity: 1; }

      .smj-loading-content {
        background: #ffffff;
        padding: 28px 40px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .smj-loading-spinner { display:flex; gap:8px; align-items:center; }
      .smj-loading-dot {
        width:10px; height:10px; border-radius:50%;
        background:#5865f2; /* Discord purple */
        animation: smj-bounce 1.4s infinite ease-in-out both;
      }
      .smj-loading-dot:nth-child(1){ animation-delay: -0.32s; }
      .smj-loading-dot:nth-child(2){ animation-delay: -0.16s; }
      @keyframes smj-bounce {
        0%,80%,100%{ transform:scale(0.7); opacity:0.5; } 40%{ transform:scale(1); opacity:1; }
      }
      .smj-loading-text { margin:0; font-size:14px; font-weight:600; color:#374151; }

      /* Modal Overlay */
      #smj-modal {
        position: fixed; inset:0;
        display:flex; align-items:center; justify-content:center;
        background: rgba(0,0,0,0.8);
        z-index:2147483647; opacity:0; transition: opacity .35s;
        padding:20px; box-sizing:border-box; pointer-events:auto; backdrop-filter: blur(12px);
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        touch-action: pan-y;
      }
      #smj-modal.smj-show { opacity: 1; }

      .smj-box { 
        position:relative; width:100%; max-width:520px; 
        transform: scale(0.94) translateY(20px);
        transition: transform .36s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      #smj-modal.smj-show .smj-box { transform: scale(1) translateY(0); }

      .smj-modal-card { 
        background: #ffffff; 
        border-radius: 20px; 
        overflow: hidden; 
        box-shadow: 0 30px 70px rgba(88,101,242,0.12), 0 6px 18px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.06);
        position: relative;
      }

      /* Header with Logo and Close */
      .smj-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: transparent; /* keep simple so image stands out */
      }

      .smj-logo {
        height: 40px;
        width: auto;
        object-fit: contain;
      }

      .smj-close-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 10px;
        background: #ffffff;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.16s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      }

      .smj-close-btn:hover {
        background: #f1f5f9;
        color: #334155;
        transform: scale(1.03);
      }

      .smj-close-btn:focus {
        outline: 3px solid rgba(88,101,242,0.28);
        outline-offset: 2px;
      }

      /* Main Content Area */
      .smj-content {
        padding: 0;
        background: #ffffff;
        position: relative; /* important for overlay button */
      }

      .smj-main-img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 420px;
        object-fit: cover;
      }

      /* JOIN DISCORD overlay button (inside image bottom) */
      .smj-join-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 18px;
        width: 160px; /* requested width */
        padding: 12px 16px;
        border-radius: 999px;
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        background: #5865f2; /* Discord purple */
        color: #ffffff;
        box-shadow: 0 12px 30px rgba(88,101,242,0.24), 0 0 28px rgba(88,101,242,0.14);
        transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
      }

      .smj-join-btn:hover {
        background: #4752c4; /* darker purple on hover */
        transform: translateX(-50%) translateY(-3px);
        box-shadow: 0 18px 40px rgba(71,82,196,0.26), 0 0 36px rgba(71,82,196,0.16);
      }

      .smj-join-btn svg { flex: 0 0 auto; }
      .smj-join-text { letter-spacing: 0.6px; }

      /* Footer decorative thin line */
      .smj-footer {
        height: 3px;
        background: linear-gradient(90deg,#5865f2,#4752c4);
        width: 100%;
      }

      /* Responsive Design */
      @media (max-width: 600px) {
        .smj-box { max-width: 95%; margin: 10px; }
        .smj-modal-card { border-radius: 14px; }
        .smj-header { padding: 12px 14px; }
        .smj-logo { height: 32px; }
        .smj-close-btn { width: 36px; height: 36px; }
        .smj-main-img { max-height: 340px; }
        .smj-join-btn { bottom: 14px; width: 150px; padding: 10px 14px; font-size: 13px; }
      }

      @media (max-width: 420px) {
        .smj-join-btn { width: 130px; padding: 8px 12px; font-size: 12px; bottom: 12px; }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .smj-modal-card { background: #0b1020; box-shadow: 0 30px 70px rgba(0,0,0,0.6); }
        .smj-close-btn { background: #0f1724; color:#cbd5e1; }
        .smj-footer { background: linear-gradient(90deg,#4752c4,#3b3fa6); }
        .smj-loading-content { background:#111827; color:#f9fafb; }
        .smj-loading-text { color:#e6eefc; }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        #smj-modal, #smj-loading, .smj-box, .smj-btn, .smj-close-btn { transition: none; }
        .smj-loading-dot { animation: none; }
      }

      /* Print styles */
      @media print {
        #smj-modal, #smj-loading { display: none !important; }
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
      redirectUrl, downloadUrl, imageUrl, logoUrl, showAfterMs: SHOW_AFTER_MS, escClose: ENABLE_ESC_CLOSE
    }
  };
})();

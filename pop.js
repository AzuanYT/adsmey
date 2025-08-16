(function () {
  // === CONFIG (ganti sesuai kebutuhan) ===
  const redirectUrl = "https://otieu.com/4/9708078";
  const downloadUrl = "https://juamey.rf.gd/ads.html";
  const imageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicYADve-sbUkhFv01gQUzn5hWc1EatCdp_y81avJlOHRnRTqyNLQNTf6ajewiP55baB-_sXH5slmIbb0rnMQU6KiaT9V2-X2XRwlu0Tbj3JySopymB4VNZnCPLS24Dv_SQDQHfoqyWE0h5u-9vWKoYU3sfqcjvvMAoDgGuuNZL2MkPDad6PL38NFMpqAs/s1600/ads.png";
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

  function lockBodyScrollSmart() {
    document.body.style.position = 'relative';
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.addEventListener("touchmove", preventBounce, { passive: false });
    }
  }

  function unlockBodyScrollSmart() {
    document.body.style.position = '';
    document.removeEventListener("touchmove", preventBounce);
  }

  function preventBounce(e) {
    const target = e.target.closest('#smj-modal');
    if (!target) return;
    if (target.scrollTop === 0 && e.touches[0].clientY > e.touches[0].clientY) {
      e.preventDefault();
    }
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
    // Show loading overlay
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "smj-loading";
    loadingOverlay.innerHTML = `
      <div class="smj-loading-content">
        <div class="smj-spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    lockBodyScrollSmart();
    setTimeout(() => loadingOverlay.classList.add("smj-show"), 10);

    // Preload image
    const preloadImg = new Image();
    preloadImg.onload = () => {
      setTimeout(() => {
        loadingOverlay.remove();
        createAndShowModal();
      }, 300);
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
    overlay.style.pointerEvents = "none";

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

    const badge = document.createElement("div");
    badge.className = "smj-badge";
    badge.textContent = "ADS";

    const closeBtn = document.createElement("button");
    closeBtn.className = "smj-close";
    closeBtn.setAttribute("aria-label", "Close advertisement");
    closeBtn.innerHTML = "&times;";

    const linkWrap = document.createElement("a");
    linkWrap.href = redirectUrl;
    linkWrap.target = "_blank";
    linkWrap.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.className = "smj-img";
    img.src = imageUrl;
    img.alt = "Promotional image — click to open";
    img.loading = "lazy";

    linkWrap.appendChild(img);
    imgWrap.appendChild(linkWrap);

    const overlayBtns = document.createElement("div");
    overlayBtns.className = "smj-imgbtns";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "smj-imgbtn smj-cancel";
    cancelBtn.textContent = "Cancel";

    const nextBtn = document.createElement("button");
    nextBtn.className = "smj-imgbtn smj-next";
    nextBtn.textContent = "Order";

    overlayBtns.appendChild(cancelBtn);
    overlayBtns.appendChild(nextBtn);

    imgWrap.appendChild(badge);
    imgWrap.appendChild(closeBtn);
    imgWrap.appendChild(overlayBtns);

    box.appendChild(imgWrap);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    lockBodyScrollSmart();
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

    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCancelWithURL(); });
    img.addEventListener("click", (e) => { e.stopPropagation(); actionNextWithDownload(); });
    cancelBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCloseNoRedirect(); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); actionNextWithDownload(); });

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


#smj-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.65); /* abu2 transparan */
  z-index: 2147483648;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-family: 'Montserrat', sans-serif; /* font Montserrat */
}

#smj-loading.smj-show {
  opacity: 1;
}

.smj-loading-content {
  background: #fff; /* kotak putih */
  padding: 30px 50px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.smj-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(65,105,225,0.2);
  border-top: 5px solid #4169e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 18px;
}

.smj-loading-content p {
  margin: 0;
  font-size: 16px;   /* sedang */
  font-weight: 600;  /* tebal sedang */
  color: #4169e1;
  letter-spacing: 0.5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
#smj-modal { 
  position: fixed; 
  inset: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(0,0,0,0.65); 
  z-index: 2147483647; 
  opacity: 0; 
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); 
  padding: 24px; 
  box-sizing: border-box; 
  pointer-events: none;
  backdrop-filter: blur(2px);
}

#smj-modal.smj-show { 
  opacity: 1; 
}

#smj-modal .smj-box { 
  position: relative; 
  background: transparent; 
  border-radius: 16px; 
  width: 100%; 
  max-width: 480px; 
  box-sizing: border-box; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  pointer-events: auto;
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

#smj-modal.smj-show .smj-box {
  transform: scale(1);
}

.smj-imgwrap { 
  position: relative; 
  width: 100%; 
  background: #fff; 
  border-radius: 16px; 
  overflow: hidden; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
}

.smj-badge { 
  position: absolute; 
  left: 16px; 
  top: 16px; 
  border: 1px solid rgba(0,0,0,0.08); 
  padding: 6px 10px; 
  border-radius: 20px; 
  font-size: 12px; 
  font-weight: 600;
  color: #333; 
  background: rgba(255,255,255,0.95); 
  z-index: 6; 
  backdrop-filter: blur(8px);
}

.smj-close { 
  position: absolute; 
  right: 16px; 
  top: 14px; 
  min-width: 40px; 
  height: 40px; 
  border-radius: 20px; 
  border: 1px solid rgba(0,0,0,0.08); 
  background: rgba(255,255,255,0.95); 
  font-size: 20px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  color: #333; 
  z-index: 6;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.smj-close:hover {
  background: rgba(255,255,255,1);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.smj-img { 
  display: block; 
  width: 100%; 
  height: auto; 
  max-height: 360px; 
  object-fit: cover; 
  cursor: pointer; 
  transition: transform 0.3s ease;
}

.smj-img:hover {
  transform: scale(1.02);
}

.smj-imgbtns { 
  position: absolute; 
  left: 50%; 
  transform: translateX(-50%); 
  bottom: 16px; 
  display: flex; 
  gap: 12px; 
  z-index: 6; 
}

.smj-imgbtn { 
  padding: 10px 16px; 
  border-radius: 24px; 
  border: none; 
  font-size: 14px; 
  font-weight: 600;
  cursor: pointer; 
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); 
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.smj-imgbtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
}

.smj-cancel { 
  background: rgba(255,255,255,0.95); 
  color: #333; 
  border: 1px solid rgba(0,0,0,0.08); 
}

.smj-cancel:hover {
  background: rgba(255,255,255,1);
}

.smj-next { 
	
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; 
  
}

.smj-next:hover {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

@media (max-width: 520px) {
  #smj-modal { 
    padding: 16px; 
  }
  
  .smj-badge { 
    left: 12px; 
    top: 12px; 
    padding: 4px 8px; 
    font-size: 11px; 
    border-radius: 16px;
  }
  
  .smj-close { 
    right: 12px; 
    top: 10px; 
    min-width: 36px; 
    height: 36px; 
    font-size: 18px; 
    border-radius: 18px;
  }
  
  .smj-imgbtn { 
    padding: 8px 14px; 
    font-size: 13px; 
    border-radius: 20px; 
  }
  
  .smj-imgbtns {
    bottom: 12px;
    gap: 10px;
  }
}

.smj-close:focus,
.smj-imgbtn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .smj-badge,
  .smj-close,
  .smj-cancel {
    background: rgba(30,30,30,0.95);
    color: #e5e5e5;
    border-color: rgba(255,255,255,0.1);
  }
  
  .smj-close:hover,
  .smj-cancel:hover {
    background: rgba(40,40,40,0.95);
  }
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

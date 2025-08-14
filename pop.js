(function () {
  // === CONFIG (ganti sesuai kebutuhan) ===
  const redirectUrl = "https://otieu.com/4/9708078";
  const downloadUrl = "mailto:azuanpribadi@gmail.com?subject=Ad%20Placement&body=Hello%2C%20I%20am%20interested%20in%20advertising%20on%20your%20website.";
  const imageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicYADve-sbUkhFv01gQUzn5hWc1EatCdp_y81avJlOHRnRTqyNLQNTf6ajewiP55baB-_sXH5slmIbb0rnMQU6KiaT9V2-X2XRwlu0Tbj3JySopymB4VNZnCPLS24Dv_SQDQHfoqyWE0h5u-9vWKoYU3sfqcjvvMAoDgGuuNZL2MkPDad6PL38NFMpqAs/s1600/ads.png";
  const SHOW_AFTER_MS = 6000; // muncul sekali setelah 8 detik
  const DOWNLOAD_DELAY_MS = 200; // delay kecil sebelum "click" link

  // === INTERNAL STATE ===
  let timerId = null;
  let hasShown = false;
  let prevActiveElement = null;
  let keydownHandler = null;

  function startTimerOnce() {
    clearTimeout(timerId);
    // hanya schedule kalau belum pernah ditampilkan pada page load ini
    if (!hasShown) {
      timerId = setTimeout(showModal, SHOW_AFTER_MS);
    }
  }

  function lockBodyScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", preventTouch, { passive: false });
  }
  function unlockBodyScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.removeEventListener("touchmove", preventTouch);
  }
  function preventTouch(e) { e.preventDefault(); }

  function removeModalIfAny() {
    const old = document.getElementById("smj-modal");
    if (old) {
      document.removeEventListener("keydown", keydownHandler);
      old.classList.remove("smj-show");
      unlockBodyScroll();
      if (prevActiveElement && typeof prevActiveElement.focus === "function") {
        try { prevActiveElement.focus(); } catch (e) { /* ignore */ }
      }
      setTimeout(() => old?.remove(), 240);
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
    hasShown = true; // tandai sudah tampil untuk page load ini

    removeModalIfAny();

    prevActiveElement = document.activeElement;

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

    const imgWrap = document.createElement("div");
    imgWrap.className = "smj-imgwrap";

    const badge = document.createElement("div");
    badge.className = "smj-badge";
    badge.textContent = "ADS";

    const closeBtn = document.createElement("button");
    closeBtn.className = "smj-close";
    closeBtn.setAttribute("aria-label", "Close advertisement");
    closeBtn.innerHTML = "&times;";

    const img = document.createElement("img");
    img.className = "smj-img";
    img.src = imageUrl;
    img.alt = "Promotional image — click to open";
    img.addEventListener("error", () => { img.style.display = "none"; });

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

    imgWrap.appendChild(img);
    imgWrap.appendChild(badge);
    imgWrap.appendChild(closeBtn);
    imgWrap.appendChild(overlayBtns);

    box.appendChild(imgWrap);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    lockBodyScroll();
    setTimeout(() => overlay.classList.add("smj-show"), 10);

    setTimeout(() => {
      try { closeBtn.focus(); } catch (e) { /* ignore */ }
    }, 60);

    function actionCloseNoRedirect() {
      removeModalIfAny();
      // hasShown sudah true, jadi modal tidak akan dijadwalkan lagi kecuali di-refresh
    }

    function actionRedirect() {
      removeModalIfAny();
      
      window.open(redirectUrl, "_blank", "noopener"); 
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

    overlay.addEventListener("click", (e) => { e.stopPropagation(); });
    box.addEventListener("click", (e) => e.stopPropagation());

    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCloseNoRedirect(); });
    img.addEventListener("click", (e) => { e.stopPropagation(); actionRedirect(); });
    cancelBtn.addEventListener("click", (e) => { e.stopPropagation(); actionCloseNoRedirect(); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); actionNextWithDownload(); });

    keydownHandler = function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
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
#smj-modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); z-index: 2147483647; opacity: 0; transition: opacity .22s ease; padding: 24px; box-sizing: border-box; pointer-events: auto; }
#smj-modal.smj-show { opacity: 1; }
#smj-modal .smj-box { position: relative; background: transparent; border-radius: 12px; width: 100%; max-width: 480px; box-sizing: border-box; display:flex; justify-content:center; align-items:center; }
.smj-imgwrap { position: relative; width: 100%; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.28); }
.smj-badge { position: absolute; left: 12px; top: 12px; border: 1px solid rgba(0,0,0,0.12); padding: 4px 8px; border-radius: 8px; font-size: 12px; color: #111; background: rgba(255,255,255,0.95); z-index: 6; }
.smj-close { position: absolute; right: 12px; top: 10px; min-width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12); background: rgba(255,255,255,0.98); font-size: 18px; display:flex; align-items:center; justify-content:center; cursor: pointer; color: #222; z-index: 6; }
.smj-img { display:block; width:100%; height:auto; max-height: 320px; object-fit: cover; cursor: pointer; }
.smj-imgbtns { position: absolute; left: 50%; transform: translateX(-50%); bottom: 12px; display:flex; gap: 8px; z-index: 6; }
.smj-imgbtn { padding: 8px 12px; border-radius: 8px; border: none; font-size: 14px; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.16); opacity: 0.98; }
.smj-cancel { background: rgba(255,255,255,0.95); color:#222; border: 1px solid rgba(0,0,0,0.06); }
.smj-next { background: rgba(18,110,54,1); color:#fff; }
@media (max-width:480px) {
  #smj-modal { padding: 12px; }
  .smj-badge { left: 8px; top: 8px; padding: 3px 7px; font-size: 11px; }
  .smj-close { right: 8px; top: 8px; min-width: 30px; height: 30px; font-size: 16px; }
  .smj-imgbtn { padding: 7px 10px; font-size: 13px; border-radius: 7px; }
}
    `;
    const style = document.createElement("style");
    style.id = "smj-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // init
  document.addEventListener("DOMContentLoaded", () => {
    injectCSS();
    startTimerOnce(); // schedule sekali setelah SHOW_AFTER_MS (8 detik)
  });

  // debug / control
  window.SMJ = {
    showNow: () => showModal(),
    stop: () => { clearTimeout(timerId); removeModalIfAny(); unlockBodyScroll(); hasShown = true; },
    hasShown: () => hasShown
  };
})();

(() => {
  "use strict";

  const BACKEND_BASE = "https://script.google.com/macros/s/AKfycbziIiJ1ftinsWFd1YEPVoujSFJM7rhXX3kIwaUlkDOH-tFXtEEDM0ubnYZMWcBs57z0rg/exec";
  const frame = document.getElementById("astrum-verifier");
  const loading = document.getElementById("frame-loading");

  function normalizeCode(value) {
    return String(value || "").trim().replace(/\s+/g, "").toUpperCase();
  }

  function buildBackendUrl(code, language) {
    const url = new URL(BACKEND_BASE);
    if (code) url.searchParams.set("codigo", code);
    url.searchParams.set("lang", language);
    return url.toString();
  }

  frame.addEventListener("load", () => {
    loading.hidden = true;
    frame.classList.add("is-ready");
  });

  const params = new URLSearchParams(window.location.search);
  const code = normalizeCode(params.get("codigo"));

  function loadVerifier() {
    const language = window.AstrumI18n?.getLanguage() || "es";
    loading.hidden = false;
    frame.classList.remove("is-ready");
    frame.src = buildBackendUrl(code, language);
  }

  document.addEventListener("astrum:languagechange", loadVerifier);
  loadVerifier();
})();

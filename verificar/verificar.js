(() => {
  "use strict";

  const BACKEND_BASE = "https://script.google.com/macros/s/AKfycbyWQ64D2PBhQpDAy5hRkcTUbr2MDAP9TsHD3_YFK065cnGdu3FNEMd8E8Uqhc3US9sCsQ/exec";
  const form = document.getElementById("verification-form");
  const input = document.getElementById("certificate-code");
  const frame = document.getElementById("astrum-verifier");
  const loading = document.getElementById("frame-loading");

  function normalizeCode(value) {
    return value.trim().replace(/\s+/g, "").toUpperCase();
  }

  function buildBackendUrl(code) {
    const url = new URL(BACKEND_BASE);
    if (code) url.searchParams.set("codigo", code);
    return url.toString();
  }

  function syncUrl(code) {
    const current = new URL(window.location.href);
    if (code) current.searchParams.set("codigo", code);
    else current.searchParams.delete("codigo");
    window.history.replaceState({}, "", current);
  }

  function loadVerifier(code) {
    loading.hidden = false;
    frame.classList.remove("is-ready");
    frame.src = buildBackendUrl(code);
    syncUrl(code);
  }

  frame.addEventListener("load", () => {
    loading.hidden = true;
    frame.classList.add("is-ready");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = normalizeCode(input.value);
    input.value = code;

    if (!code) {
      input.setCustomValidity("Ingresa el código que aparece en el documento.");
      input.reportValidity();
      return;
    }

    input.setCustomValidity("");
    loadVerifier(code);
  });

  input.addEventListener("input", () => input.setCustomValidity(""));

  const params = new URLSearchParams(window.location.search);
  const initialCode = normalizeCode(params.get("codigo") || "");
  input.value = initialCode;
  loadVerifier(initialCode);
})();

(() => {
    "use strict";

    const config = window.RED_ASTRUM_DONATIONS || {};
    const amounts = Array.isArray(config.allowedAmounts) && config.allowedAmounts.length
        ? config.allowedAmounts : [10, 25, 50, 100];
    let brickController;
    let activeAmount = amounts[1] || amounts[0];

    const money = value => new Intl.NumberFormat("es-PE", {
        style: "currency", currency: "PEN", minimumFractionDigits: 2
    }).format(value);

    function configuredCardFlow() {
        return Boolean(config.mercadoPagoPublicKey && config.apiBaseUrl);
    }

    function setStatus(message, type = "") {
        const status = document.querySelector("[data-donation-status]");
        if (!status) return;
        status.textContent = message;
        status.className = `donation-status ${type}`;
    }

    function buildModal() {
        if (document.getElementById("donationModal")) return;
        const amountButtons = amounts.map((amount, index) =>
            `<button class="donation-amount${index === 1 ? " is-selected" : ""}" type="button" data-donation-amount="${amount}" aria-pressed="${index === 1 ? "true" : "false"}">${money(amount)}</button>`
        ).join("");

        const modal = document.createElement("section");
        modal.className = "donation-modal";
        modal.id = "donationModal";
        modal.hidden = true;
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-labelledby", "donationTitle");
        modal.innerHTML = `
            <div class="donation-modal__backdrop" data-donation-close></div>
            <div class="donation-modal__panel" role="document">
                <button class="donation-modal__close" type="button" aria-label="Cerrar donaciones" data-donation-close><i class="bx bx-x" aria-hidden="true"></i></button>
                <p class="donation-modal__eyebrow"><i class="bx bx-heart" aria-hidden="true"></i> Red Astrum</p>
                <h2 id="donationTitle">Impulsa la educación que transforma</h2>
                <p class="donation-modal__intro">Elige un monto para donar en soles (PEN).</p>
                <div class="donation-amounts" aria-label="Monto de donación">${amountButtons}</div>
                <label class="donation-custom-amount">Otro monto en soles
                    <input type="number" inputmode="decimal" min="5" max="5000" step="0.01" placeholder="Ej. 75" data-donation-custom-amount>
                </label>
                <div class="donation-tabs" role="tablist" aria-label="Método de donación">
                    <button type="button" role="tab" aria-selected="true" aria-controls="donation-card" id="donation-card-tab" data-donation-tab="card">Tarjeta</button>
                    <button type="button" role="tab" aria-selected="false" aria-controls="donation-yape" id="donation-yape-tab" data-donation-tab="yape">Yape</button>
                    <button type="button" role="tab" aria-selected="false" aria-controls="donation-cci" id="donation-cci-tab" data-donation-tab="cci">Transferencia CCI</button>
                </div>
                <div class="donation-panel" id="donation-card" role="tabpanel" aria-labelledby="donation-card-tab" data-donation-panel="card">
                    <p class="donation-note">Pago seguro con tarjeta de crédito o débito mediante Mercado Pago.</p>
                    <div id="cardPaymentBrick_container"></div>
                    <p class="donation-setup-note" data-card-unconfigured${configuredCardFlow() ? " hidden" : ""}>El pago con tarjeta se habilitará al configurar la clave pública de prueba y la URL segura del servidor.</p>
                </div>
                <div class="donation-panel" id="donation-yape" role="tabpanel" aria-labelledby="donation-yape-tab" data-donation-panel="yape" hidden>
                    <p class="donation-note">${config.yape?.enabled && config.yape?.number ? `Envía por Yape al <strong>${config.yape.number}</strong>${config.yape.holder ? `, a nombre de ${config.yape.holder}` : ""}.` : "Yape no se publica como un Brick web independiente en la documentación actual de Mercado Pago. Se habilitará aquí cuando Red Astrum tenga el flujo de Yape aprobado y sus datos verificados."}</p>
                </div>
                <div class="donation-panel" id="donation-cci" role="tabpanel" aria-labelledby="donation-cci-tab" data-donation-panel="cci" hidden>
                    <p class="donation-note">${config.cci?.number ? `Transfiere ${money(activeAmount)} a la CCI <strong>${config.cci.number}</strong>${config.cci.bank ? ` (${config.cci.bank})` : ""}${config.cci.holder ? `, titular ${config.cci.holder}` : ""}.` : "La transferencia por CCI se gestionará como un flujo independiente. Los datos bancarios se habilitarán después de validarlos."}</p>
                    ${config.cci?.number ? '<button class="donation-copy" type="button" data-donation-copy-cci>Copiar CCI</button>' : ""}
                </div>
                <p class="donation-status" role="status" aria-live="polite" data-donation-status></p>
                <p class="donation-test-badge">${config.environment === "test" ? "Modo de prueba: no se realizará ningún cobro real." : ""}</p>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelectorAll("[data-donation-close]").forEach(button => button.addEventListener("click", closeModal));
        modal.querySelectorAll("[data-donation-amount]").forEach(button => button.addEventListener("click", () => selectAmount(Number(button.dataset.donationAmount))));
        modal.querySelector("[data-donation-custom-amount]").addEventListener("input", event => {
            const value = Number(event.target.value);
            if (Number.isFinite(value) && value >= 5 && value <= 5000) selectAmount(value, false);
        });
        modal.querySelectorAll("[data-donation-tab]").forEach(button => button.addEventListener("click", () => selectTab(button.dataset.donationTab)));
        modal.querySelector("[data-donation-copy-cci]")?.addEventListener("click", async () => {
            await navigator.clipboard?.writeText(config.cci.number);
            setStatus("CCI copiada.", "success");
        });
    }

    function selectAmount(value, clearCustom = true) {
        activeAmount = Math.round(value * 100) / 100;
        document.querySelectorAll("[data-donation-amount]").forEach(button => {
            const selected = Number(button.dataset.donationAmount) === activeAmount;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        if (clearCustom) document.querySelector("[data-donation-custom-amount]").value = "";
        const cciPanel = document.querySelector("[data-donation-panel=cci]");
        if (cciPanel && config.cci?.number) cciPanel.querySelector(".donation-note").innerHTML = `Transfiere ${money(activeAmount)} a la CCI <strong>${config.cci.number}</strong>${config.cci.bank ? ` (${config.cci.bank})` : ""}${config.cci.holder ? `, titular ${config.cci.holder}` : ""}.`;
        if (brickController) renderCardBrick();
    }

    function selectTab(name) {
        document.querySelectorAll("[data-donation-tab]").forEach(button => {
            const selected = button.dataset.donationTab === name;
            button.setAttribute("aria-selected", String(selected));
        });
        document.querySelectorAll("[data-donation-panel]").forEach(panel => panel.hidden = panel.dataset.donationPanel !== name);
        if (name === "card") renderCardBrick(); else destroyBrick();
    }

    function destroyBrick() {
        if (!brickController) return;
        brickController.unmount?.();
        brickController = undefined;
    }

    async function loadSdk() {
        if (window.MercadoPago) return;
        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.onload = resolve;
            script.onerror = () => reject(new Error("No se pudo cargar Mercado Pago."));
            document.head.appendChild(script);
        });
    }

    async function renderCardBrick() {
        if (!configuredCardFlow() || document.querySelector("[data-donation-panel=card]")?.hidden) return;
        destroyBrick();
        try {
            await loadSdk();
            const mp = new window.MercadoPago(config.mercadoPagoPublicKey, { locale: "es-PE" });
            brickController = await mp.bricks().create("cardPayment", "cardPaymentBrick_container", {
                initialization: { amount: activeAmount },
                customization: { visual: { style: { theme: "dark" } }, paymentMethods: { maxInstallments: 1 } },
                callbacks: {
                    onSubmit: (formData, additionalData) => submitCardDonation(formData, additionalData),
                    onError: () => setStatus("No fue posible cargar el formulario. Inténtalo de nuevo.", "error")
                }
            });
        } catch (error) { setStatus(error.message || "No fue posible preparar el pago.", "error"); }
    }

    async function submitCardDonation(formData, additionalData) {
        setStatus("Procesando donación de prueba…");
        const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, "")}/v1/donations/card`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: activeAmount, formData, paymentType: additionalData?.paymentTypeId })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            const message = result.message || "No se pudo procesar la donación.";
            setStatus(message, "error");
            throw new Error(message);
        }
        const payment = result.order?.transactions?.payments?.[0];
        const approved = payment?.status === "processed" && payment?.status_detail === "accredited";
        setStatus(approved ? "¡Gracias! La donación de prueba fue aprobada." : "La donación está en proceso. Revisa el estado en Mercado Pago.", approved ? "success" : "");
    }

    function openModal() {
        buildModal();
        const modal = document.getElementById("donationModal");
        modal.hidden = false;
        document.body.classList.add("donation-open");
        modal.querySelector(".donation-modal__close").focus();
        renderCardBrick();
    }

    function closeModal() {
        destroyBrick();
        const modal = document.getElementById("donationModal");
        if (modal) modal.hidden = true;
        document.body.classList.remove("donation-open");
    }

    document.addEventListener("click", event => {
        if (event.target.closest("[data-donate-open]")) { event.preventDefault(); openModal(); }
    });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
})();

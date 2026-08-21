(() => {
    "use strict";

    const config = window.RED_ASTRUM_DONATIONS || {};
    const containerId = "paymentBrick_container";
    let controller;

    const status = message => {
        const element = document.getElementById("donationStatus");
        if (element) element.textContent = message;
    };

    async function render() {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!config.mercadoPagoPublicKey || !config.apiBaseUrl) {
            status("Configura la Public Key de prueba y el backend antes de activar donaciones.");
            return;
        }
        if (!window.MercadoPago) {
            status("No se pudo cargar Mercado Pago. Recarga la página.");
            return;
        }

        const mp = new window.MercadoPago(config.mercadoPagoPublicKey, { locale: "es-PE" });
        const builder = mp.bricks();
        const amount = () => Number(document.getElementById("donationAmount")?.value || 25);

        controller = await builder.create("payment", containerId, {
            initialization: { amount: amount() },
            callbacks: {
                onSubmit: async formData => {
                    status("Procesando donación de prueba…");
                    const endpoint = `${config.apiBaseUrl.replace(/\/$/, "")}${config.paymentEndpoint || "/process_order"}`;
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...formData, transaction_amount: amount() })
                    });
                    if (!response.ok) {
                        status("El backend no pudo procesar la donación.");
                        throw new Error("Payment backend error");
                    }
                    status("Solicitud enviada. Revisa el resultado de la operación.");
                    return response.json();
                },
                onError: error => {
                    console.error("Mercado Pago Payment Brick", error);
                    status("Revisa los datos ingresados e inténtalo nuevamente.");
                }
            }
        });

        const amountField = document.getElementById("donationAmount");
        if (amountField && !amountField.dataset.paymentBrickBound) {
            amountField.dataset.paymentBrickBound = "true";
            amountField.addEventListener("change", async () => {
                controller?.unmount?.();
                await render();
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => { render().catch(error => { console.error(error); status("No se pudo cargar el formulario de donación."); }); });
})();

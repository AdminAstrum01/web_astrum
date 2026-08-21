/*
 * Public donation settings. This file is intentionally safe to publish:
 * Mercado Pago Public Keys are designed for browser use. Never place an
 * Access Token or webhook secret here.
 */
window.RED_ASTRUM_DONATIONS = {
    environment: "test",
    apiBaseUrl: "", // e.g. https://red-astrum-donations.curly-grass-94b6.workers.dev
    mercadoPagoPublicKey: "", // APP_USR-1809599944828758-082111-5687cf01d20fba7d40277052db832f68-3632101616
    allowedAmounts: [10, 25, 50, 100],
    cci: {
        bank: "",
        number: "",
        holder: ""
    },
    yape: {
        enabled: false,
        number: "",
        holder: ""
    }
};

/*
 * Public donation settings. This file is intentionally safe to publish:
 * Mercado Pago Public Keys are designed for browser use. Never place an
 * Access Token or webhook secret here.
 */
window.RED_ASTRUM_DONATIONS = {
    environment: "test",
    apiBaseUrl: "", // e.g. https://donations-api.redastrum.org
    mercadoPagoPublicKey: "", // TEST public key only while developing
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

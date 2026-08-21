const ORIGINS = new Set(["https://redastrum.org", "https://www.redastrum.org", "http://localhost:8787", "http://127.0.0.1:8787"]);
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 5000;

function corsHeaders(origin) {
    if (!ORIGINS.has(origin)) return {};
    return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
}

function response(data, status = 200, origin = "") {
    return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } });
}

function cleanAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) return null;
    return amount.toFixed(2);
}

function safePayer(payer) {
    const email = typeof payer?.email === "string" ? payer.email.trim() : "";
    if (!email || email.length > 254) return null;
    const identification = payer?.identification;
    const result = { email };
    if (identification?.type && identification?.number) result.identification = { type: String(identification.type).slice(0, 20), number: String(identification.number).slice(0, 30) };
    return result;
}

async function createCardOrder(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!ORIGINS.has(origin)) return response({ message: "Origen no autorizado." }, 403, origin);
    if (!env.MP_ACCESS_TOKEN) return response({ message: "El servidor de donaciones no está configurado." }, 503, origin);

    let input;
    try { input = await request.json(); } catch { return response({ message: "Solicitud inválida." }, 400, origin); }
    const amount = cleanAmount(input.amount);
    const form = input.formData || {};
    const payer = safePayer(form.payer);
    const paymentType = input.paymentType === "debit_card" ? "debit_card" : "credit_card";
    if (!amount || !payer || !form.token || !form.payment_method_id) return response({ message: "Faltan datos de pago válidos." }, 400, origin);

    const order = {
        type: "online",
        processing_mode: "automatic",
        total_amount: amount,
        external_reference: `red-astrum-donation-${crypto.randomUUID()}`,
        description: "Donación a Red Astrum",
        payer,
        transactions: { payments: [{
            amount,
            payment_method: {
                id: String(form.payment_method_id),
                type: paymentType,
                token: String(form.token),
                installments: Math.max(1, Math.min(1, Number(form.installments) || 1))
            }
        }] }
    };
    const mpResponse = await fetch("https://api.mercadopago.com/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.MP_ACCESS_TOKEN}`, "X-Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(order)
    });
    const result = await mpResponse.json().catch(() => ({}));
    if (!mpResponse.ok) return response({ message: "Mercado Pago no pudo procesar la donación.", code: result?.cause?.[0]?.code || result?.message || "MP_ERROR" }, mpResponse.status >= 400 && mpResponse.status < 500 ? 400 : 502, origin);
    return response({ order: result }, 201, origin);
}

function parseSignature(header) {
    return Object.fromEntries((header || "").split(",").map(part => part.trim().split("=")).filter(parts => parts.length === 2));
}

function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;
    let mismatch = 0;
    for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
    return mismatch === 0;
}

async function verifyWebhook(request, secret) {
    const signature = parseSignature(request.headers.get("x-signature"));
    const requestId = request.headers.get("x-request-id") || "";
    const dataId = new URL(request.url).searchParams.get("data.id") || "";
    if (!secret || !signature.ts || !signature.v1 || !requestId || !dataId) return false;
    const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
    const expected = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
    return constantTimeEqual(expected, signature.v1);
}

async function webhook(request, env) {
    if (!(await verifyWebhook(request, env.MP_WEBHOOK_SECRET))) return new Response("Unauthorized", { status: 401 });
    // Signature verification is complete. Persisting donations is deliberately left
    // to the future database integration; do not trust the browser as a ledger.
    return new Response(null, { status: 200 });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin") || "") });
        if (request.method === "POST" && url.pathname === "/v1/donations/card") return createCardOrder(request, env);
        if (request.method === "POST" && url.pathname === "/v1/webhooks/mercadopago") return webhook(request, env);
        return new Response("Not found", { status: 404 });
    }
};

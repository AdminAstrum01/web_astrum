# Backend de donaciones de Red Astrum

Este Worker procesa únicamente donaciones por tarjeta mediante Checkout API (Orders) de Mercado Pago. El frontend publicado no contiene ningún Access Token.

## Desarrollo con credenciales de prueba

1. Instala Wrangler y autentícate con la cuenta de Cloudflare de Red Astrum.
2. Copia `.dev.vars.example` a `.dev.vars` y pega solo las credenciales de **prueba** de Mercado Pago.
3. Ejecuta `wrangler dev` dentro de esta carpeta.
4. En `../donations-config.js`, define la `mercadoPagoPublicKey` de prueba y la URL local HTTPS/túnel del Worker como `apiBaseUrl`.

Para desplegar sin secretos en GitHub:

1. Crea un Worker y asígnale un hostname HTTPS, por ejemplo `donations-api.redastrum.org`.
2. Ejecuta `wrangler secret put MP_ACCESS_TOKEN` y pega el Access Token de **prueba**.
3. Ejecuta `wrangler secret put MP_WEBHOOK_SECRET` después de configurar el webhook de prueba en Mercado Pago.
4. Despliega con `wrangler deploy`.
5. Actualiza únicamente `apiBaseUrl` y la Public Key de prueba en `donations-config.js`.

El endpoint de tarjeta es `POST /v1/donations/card`; crea una order automática en `/v1/orders` con una clave de idempotencia nueva. El endpoint verificable de webhook es `POST /v1/webhooks/mercadopago`. Verifica `x-signature`, `x-request-id` y `data.id` antes de devolver `200`.

## Antes de producción

No cambies a producción hasta añadir una base de datos o un servicio de registros para guardar idempotentemente los eventos validados y conciliar el estado final. Después, reemplaza ambos secretos y la Public Key por las credenciales de producción en los respectivos secretos/configuración pública.

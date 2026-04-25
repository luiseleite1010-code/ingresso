// Cloudflare Worker — proxy Sigilo Pay
// Deploy em: https://dash.cloudflare.com > Workers > Create Worker

const SIGILO_PUBLIC_KEY = 'hwnnar_dhbbclwut5jicr0a';
const SIGILO_SECRET_KEY = 'ajf6q9dlrk52dxh9eodiggqkdhff8uw573vawv34fsw2jhg4cb3h3ic0iyatjqrt';
const SIGILO_URL        = 'https://app.sigilopay.com.br/api/v1/gateway/pix/receive';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    try {
      const body = await request.json();

      const resp = await fetch(SIGILO_URL, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': SIGILO_PUBLIC_KEY,
          'x-secret-key': SIGILO_SECRET_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      return new Response(JSON.stringify(data), {
        status:  resp.status,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });

    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status:  500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  },
};

// Password gate for the client pitch: a branded login page that sets a cookie.
// Works in every browser and in-app webview (basic auth does not). Password comes from env var PITCH_PASS.
export const config = { matcher: '/(.*)' };

const COOKIE = 'pm_access';
const PUBLIC = ['/assets/img/logo.png', '/assets/img/favicon.png', '/assets/fonts/MessinaSans-Book.ttf', '/assets/fonts/MessinaSans-SemiBold.ttf', '/robots.txt'];

async function token(pass) {
  const data = new TextEncoder().encode('plastika-medved:' + pass);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function page(error) {
  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Plastika Medved</title><link rel="icon" href="/assets/img/favicon.png">
<style>
@font-face{font-family:"Messina Sans";src:url("/assets/fonts/MessinaSans-Book.ttf");font-weight:400}
@font-face{font-family:"Messina Sans";src:url("/assets/fonts/MessinaSans-SemiBold.ttf");font-weight:500}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;min-height:100svh;background:#f3f1ee;color:#121212;font-family:"Messina Sans","Helvetica Neue",Arial,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(20px,3.2vw,64px)}
img{height:72px;width:auto}
h1{font-size:clamp(48px,9vw,180px);font-weight:500;letter-spacing:-.045em;line-height:1;padding-bottom:.06em}
form{display:flex;gap:12px;margin-top:clamp(28px,3vw,48px);max-width:620px;flex-wrap:wrap}
input{flex:1 1 260px;font:inherit;font-size:19px;background:#fff;border:0;border-radius:10px;padding:18px 20px;outline:none}
input:focus{box-shadow:0 0 0 2px #121212}
button{font:inherit;font-size:18px;font-weight:500;padding:18px 26px;border:0;border-radius:6px;background:#d7141f;color:#fff;cursor:pointer}
button:hover{background:#121212}
p{color:#8d8a85;font-size:17px;margin-top:16px}
.err{color:#d7141f}
</style></head><body>
<img src="/assets/img/logo.png" alt="Plastika Medved d.o.o.">
<main><h1>Predstavitev nove spletne strani</h1>
<form method="post" action="/__vstop"><input type="password" name="geslo" placeholder="Geslo" autocomplete="current-password" autofocus required><button type="submit">Vstop</button></form>
<p class="${error ? 'err' : ''}">${error ? 'Geslo ni pravilno. Poskusite znova.' : 'Stran je zaščitena z geslom.'}</p></main>
<p>Plastika Medved d.o.o. · Dragonja vas 30, Cirkovce</p>
</body></html>`;
}

const html = (body, status = 200, extra = {}) => new Response(body, {
  status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', ...extra }
});

export default async function middleware(request) {
  const url = new URL(request.url);
  const pass = process.env.PITCH_PASS;
  if (!pass) return html('Not configured', 503);
  if (PUBLIC.includes(url.pathname)) return;

  const good = await token(pass);

  if (url.pathname === '/__vstop' && request.method === 'POST') {
    const body = await request.text().catch(() => '');
    const geslo = new URLSearchParams(body).get('geslo');
    if (geslo === pass) {
      return new Response(null, { status: 303, headers: {
        Location: '/', 'Cache-Control': 'no-store',
        'Set-Cookie': `${COOKIE}=${good}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`
      }});
    }
    return html(page(true), 401);
  }

  const cookie = (request.headers.get('cookie') || '').split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
  if (cookie && cookie.slice(COOKIE.length + 1) === good) return;

  // basic auth still accepted (scripts, curl)
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    const [, ...rest] = atob(auth.slice(6)).split(':');
    if (rest.join(':') === pass) return;
  }

  return html(page(false), 401);
}

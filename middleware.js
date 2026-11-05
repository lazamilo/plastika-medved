// Basic-auth gate for the client pitch. Credentials come from project env vars PITCH_USER / PITCH_PASS.
export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const user = process.env.PITCH_USER, pass = process.env.PITCH_PASS;
  if (!user || !pass) return new Response('Not configured', { status: 503 });
  const auth = request.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [u, ...rest] = atob(encoded).split(':');
    if (u === user && rest.join(':') === pass) return;
  }
  return new Response('Prijava je potrebna.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Plastika Medved", charset="UTF-8"', 'X-Robots-Tag': 'noindex, nofollow' }
  });
}

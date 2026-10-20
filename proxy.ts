import { NextResponse, type NextRequest } from 'next/server';

// proposta.jonathanbolanle.studio/<cliente> leva para as páginas em public/proposta/<cliente>/.
export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  if (!host.startsWith('proposta.')) return;
  const { pathname, search } = request.nextUrl;
  const path = pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;
  return NextResponse.redirect(`https://${host.slice('proposta.'.length)}/proposta${path}${search}`, 302);
}

/**
 * The site answers to curl.
 *
 * Static assets serve every request directly except "/", which runs through
 * here first (run_worker_first). Terminal clients get an ANSI business card;
 * everything else falls through to the built site unchanged.
 */

const A = '\x1b[38;2;221;157;84m'; // amber
const G = '\x1b[38;2;122;183;122m'; // ok green
const D = '\x1b[38;2;133;140;150m'; // dim
const B = '\x1b[1m';
const R = '\x1b[0m';

const CARD = `
 ${D}┌─────────────────────────────────────────────────────────┐${R}
 ${D}│${R}                                                         ${D}│${R}
 ${D}│${R}   ${B}${A}Serhiy Kucherenko${R}                                     ${D}│${R}
 ${D}│${R}   software architect who builds AI systems              ${D}│${R}
 ${D}│${R}                                                         ${D}│${R}
 ${D}│${R}   .NET / banking (9y) ${D}──▶${R} ${A}AI systems${R} ${D}──▶${R} ${G}your system${R}    ${D}│${R}
 ${D}│${R}                                                         ${D}│${R}
 ${D}│${R}   ${D}web${R}    https://serhiykucherenko.dev                  ${D}│${R}
 ${D}│${R}   ${D}demo${R}   https://rag.serhiykucherenko.dev              ${D}│${R}
 ${D}│${R}   ${D}code${R}   https://github.com/KucherenkoSerhiy           ${D}│${R}
 ${D}│${R}   ${D}mail${R}   kucherenkoserhiy@gmail.com                    ${D}│${R}
 ${D}│${R}                                                         ${D}│${R}
 ${D}│${R}   ${G}●${R} open to freelance ${D}· rag · llm cost · .net${R}          ${D}│${R}
 ${D}│${R}                                                         ${D}│${R}
 ${D}└─────────────────────────────────────────────────────────┘${R}
   ${D}the browser version has diagrams. this one has you.${R}

`;

const isTerminal = (req) => {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  return ua.includes('curl') || ua.includes('wget') || ua.includes('httpie');
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' && isTerminal(request)) {
      return new Response(CARD, {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};

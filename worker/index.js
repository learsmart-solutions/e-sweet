// Fallback for app routes requested by link crawlers.
//
// Cloudflare serves files from ./dist first. For a page a browser opens
// (a request with `Sec-Fetch-Mode: navigate`), single-page-application mode
// returns index.html without running this script at all.
//
// Crawlers such as WhatsApp's link preview, Facebook and Googlebot don't send
// that header, so for /menu, /settings/orders or /r/CODE Cloudflare would
// answer 404. This script runs only for those leftover requests: anything that
// isn't a real file gets the app, so shared links still unfurl and pages stay
// indexable. A missing file (a path with an extension, e.g. an old
// /assets/index-abc.js) still returns a real 404.
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const { pathname } = new URL(request.url);
    if (/\.[a-z0-9]+$/i.test(pathname)) return response;

    // "/" rather than "/index.html": the asset server redirects
    // /index.html to /.
    return env.ASSETS.fetch(new URL("/", request.url));
  },
};

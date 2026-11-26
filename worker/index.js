// Fallback for app routes requested by link crawlers.
//
// Cloudflare serves files from ./dist first. For a page a browser opens
// (a request with `Sec-Fetch-Mode: navigate`), single-page-application mode
// returns index.html without running this script at all.
//
// Crawlers such as WhatsApp's link preview, Facebook and Googlebot don't send
// that header. Without this script Cloudflare answered them 404 for /menu,
// /settings/orders or /r/CODE (checked on the PR #37 preview), so shared
// links wouldn't unfurl and pages could drop out of search.
//
// Passing the request to the ASSETS binding applies the single-page fallback
// whatever the headers, so crawlers get the app with a 200, the same as the
// live site did before this config existed. Tested on the preview: browsers,
// WhatsApp, Facebook and Googlebot all get 200 on those routes.
//
// Note: like the live site before, a missing file (e.g. an old
// /assets/index-abc.js) also gets index.html with a 200. The extension check
// below only applies if the asset server ever returns a real 404; then
// missing files stay 404 and only app routes fall back to the app.
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

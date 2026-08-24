interface Env {
  SITE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const accept = request.headers.get("accept") || "";

    if (!accept.includes("text/markdown")) {
      return fetch(request);
    }

    const pathname = url.pathname;
    if (pathname === "/" || pathname.endsWith("/") || pathname.startsWith("/markdown")) {
      return fetch(request);
    }

    const markdownPath = `/markdown${pathname}.md`;
    const markdownUrl = new URL(markdownPath, url.origin);

    try {
      const markdownResponse = await fetch(markdownUrl.toString());
      if (!markdownResponse.ok) {
        return fetch(request);
      }

      const markdown = await markdownResponse.text();
      const tokenCount = Math.ceil(markdown.length / 4);

      return new Response(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "x-markdown-tokens": String(tokenCount),
          "Cache-Control": "public, max-age=3600",
          "Vary": "Accept",
        },
      });
    } catch {
      return fetch(request);
    }
  },
};

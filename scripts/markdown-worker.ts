interface Env {
  SITE_URL: string;
}

const LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"',
  '</llms.txt>; rel="service-doc"',
  '</llms.txt>; rel="describedby"',
  '</auth.md>; rel="auth"',
  '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
  '</.well-known/http-message-signatures-directory>; rel="http-message-signatures-directory"',
  '</dns-aid.md>; rel="dns-aid"',
  '</.well-known/acp.json>; rel="acp"',
  '</.well-known/agent-card.json>; rel="agent-card"',
  '</.well-known/ucp>; rel="ucp"',
  '</openapi.json>; rel="x402"',
].join(", ");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const accept = request.headers.get("accept") || "";

    if (!accept.includes("text/markdown")) {
      const response = await fetch(request);
      if (url.pathname === "/" || url.pathname === "/index.html") {
        const headers = new Headers(response.headers);
        headers.set("Link", LINK_HEADER);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
      return response;
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

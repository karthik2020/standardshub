import http from "http";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PORT = 3000;
const projectRoot = join(process.cwd(), "dist");

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const accept = req.headers.accept || "";

  const serveFile = (filePath: string, contentType: string) => {
    if (!existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  };

  const tryMarkdown = (pathname: string) => {
    if (pathname === "/" || pathname.endsWith("/")) {
      return false;
    }

    let markdownPath = join(projectRoot, "markdown", pathname + ".md");
    if (existsSync(markdownPath)) {
      const markdown = readFileSync(markdownPath, "utf-8");
      const tokenCount = Math.ceil(markdown.length / 4);
      res.writeHead(200, {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(tokenCount),
        "Cache-Control": "public, max-age=3600",
        "Vary": "Accept",
      });
      res.end(markdown);
      return true;
    }
    return false;
  };

  if (accept.includes("text/markdown")) {
    if (tryMarkdown(url.pathname)) {
      return;
    }
  }

  let filePath = join(projectRoot, url.pathname);
  if (url.pathname.endsWith("/")) {
    filePath = join(filePath, "index.html");
  } else if (!existsSync(filePath) && !url.pathname.includes(".")) {
    filePath = join(filePath, "index.html");
  }

  const contentType = filePath.endsWith(".html")
    ? "text/html; charset=utf-8"
    : filePath.endsWith(".css")
      ? "text/css"
      : filePath.endsWith(".js")
        ? "application/javascript"
        : filePath.endsWith(".json")
          ? "application/json"
          : filePath.endsWith(".md")
            ? "text/markdown; charset=utf-8"
            : "application/octet-stream";

  serveFile(filePath, contentType);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Test markdown negotiation:");
  console.log(`  curl -H "Accept: text/markdown" http://localhost:${PORT}/usgaap/asc105`);
});

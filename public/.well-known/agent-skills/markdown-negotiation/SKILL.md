# Markdown Content Negotiation

Fetch accounting standards from StandardsHub as clean Markdown instead of dense HTML.

## When to Use

- An agent needs to read or analyze a specific accounting standard
- HTML scraping would waste tokens on navigation, scripts, and styling
- The agent wants structured, readable text for reasoning

## How to Request

Send a standard HTTP GET request with an `Accept: text/markdown` header.

```bash
curl -H "Accept: text/markdown" https://standardshub.in/usgaap/asc105
```

## Response

- `Content-Type: text/markdown; charset=utf-8`
- `x-markdown-tokens` header with estimated token count
- Clean Markdown with YAML frontmatter and body text

## Direct File Access

Pre-generated Markdown files are also available at:

```
https://standardshub.in/markdown/{framework}/{slug}.md
```

Example: `https://standardshub.in/markdown/usgaap/asc105.md`
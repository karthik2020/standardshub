# auth.md

Agent authentication and registration discovery for StandardsHub.

## Audience

This document is intended for AI agents and automated systems that consume StandardsHub programmatically.

## Access Model

StandardsHub is a public reference library. No authentication, registration, or API keys are required to access published content.

## Supported Methods

- Unauthenticated HTTP GET on any published standard page with `Accept: text/markdown`
- Public static access to pre-generated Markdown files under `/markdown/`
- Agent discovery via `/llms.txt` and `/.well-known/api-catalog`

## Credential Use

Credentials are not used. All published standards are openly accessible without authentication, subject to the site's terms of use.

## Agent Registration

No agent registration is required. Agents may fetch content directly using standard HTTP requests.

### Markdown Content Endpoint

```
GET /{framework}/{slug}
Accept: text/markdown
```

Returns a clean Markdown representation of the requested accounting standard with `Content-Type: text/markdown` and `x-markdown-tokens` headers.

### Static Markdown Files

```
GET /markdown/{framework}/{slug}.md
```

Direct access to pre-generated Markdown files without content negotiation.

## Discovery

- API catalog: `/.well-known/api-catalog`
- OpenAPI description: `/openapi.json`
- Agent index: `/llms.txt`
- OAuth Authorization Server metadata: `/.well-known/oauth-authorization-server`
- OAuth Protected Resource metadata: `/.well-known/oauth-protected-resource`
- Agent Skills discovery index: `/.well-known/agent-skills/index.json`
- MCP Server Card: `/.well-known/mcp/server-card.json`
- HTTP Message Signatures Directory: `/.well-known/http-message-signatures-directory`
- DNS-AID Configuration: `/dns-aid.md`
- ACP Discovery Document: `/.well-known/acp.json`
- A2A Agent Card: `/.well-known/agent-card.json`
- Universal Commerce Protocol: `/.well-known/ucp`
- x402 Payment Protocol: `/openapi.json`

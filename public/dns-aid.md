# DNS-AID Configuration for StandardsHub

This file documents the DNS for AI Discovery (DNS-AID) records required for `standardshub.in`.

## Required DNS Records

Create these records in the Cloudflare DNS dashboard for `standardshub.in`:

### A2A Agent Discovery

```
_a2a._agents.standardshub.in. 3600 IN SVCB 1 standardshub.in. alpn="a2a" port=443 mandatory=alpn,port
```

### API Catalog Index

```
_index._agents.standardshub.in. 3600 IN SVCB 1 standardshub.in. alpn="h2" port=443 mandatory=alpn,port
```

## DNSSEC

Enable DNSSEC for `standardshub.in` in the Cloudflare dashboard so validating resolvers return authenticated data.

## Experimental SvcParamKeys

Until DNS-AID SvcParamKeys are formally registered, use numeric `keyNNNNN` names for custom parameters in SVCB/HTTPS records.

## Verification

Test with DNS-over-HTTPS:

```bash
curl -H "Accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=_a2a._agents.standardshub.in&type=SVCB"
```

## References

- [RFC Editor - DNS for AI Discovery](https://datatracker.ietf.org/wg/webbotauth/about/)
- [Cloudflare DNS](https://developers.cloudflare.com/dns/)

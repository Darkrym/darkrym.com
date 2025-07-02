---
author: 
name: Darkrym
date: 2025-07-01
linktitle: 
type:
  - post
  - posts
title: Using OpenScanner for IP & Domain Triage
weight: 10
series:
  - guide
  - tool
---
Whether you're triaging phishing domains or chasing infrastructure from an IOC, time matters. I built **OpenScanner** to automate the repetitive but essential steps we all take during IP/domain investigations and to complement the cheat sheet I posted earlier. 

This post covers how to use the tool, how it ties into an investigation workflow, and goes through a real world case to demonstrate how to identify suspicious behaviour and infrastructure traits.

---

## What Is OpenScanner?

**OpenScanner** is a Python tool that automates reputation lookups, DNS resolution, WHOIS checks, passive DNS, certificate transparency, and more. It helps answer the key questions quickly:

- Is this IP known malicious?
- Is this domain newly registered or have suspicious DNS Records?
- Does it point to cloud infrastructure, a VPN, or a TOR node?
- Are there passive or historical DNS/WHOIS records?
- Are there redirect chains, shortened URLs, or payloads involved?

## Why Use It?

OpenScanner speeds up OSINT investigations and gives analysts:
- A full profile of a domain or IP from multiple angles
- Clear output with minimal input
- Separation of IP vs domain logic
- Highlighting of common red flags and suspicious indicators

It complements any incident response, threat hunting, or phishing triage workflow.

---

## Installation & Setup

Download the OpenScanner.py file from my [GitHub](https://github.com/Darkrym/soc-tools)
### Requirements
- Python 3.10+
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

### API Keys

The following API keys are required for full functionality. Don’t worry if you don’t have all of them the tool will automatically skip any services that are not configured.

| Service        | API Key Required | Notes                        |
| -------------- | ---------------- | ---------------------------- |
| AbuseIPDB      | Yes              | Free up to 1,000 queries/day |
| GreyNoise      | Yes              | Use the community API        |
| VirusTotal     | Yes              | Paid API required            |
| Shodan         | Yes              | Paid API required            |
| URLScan.io     | Yes              | Free, but key is required    |
| Censys         | Yes              | Free tier available          |
| SecurityTrails | Yes              | Basic WHOIS/subdomain access |

**Note:** The free tier of most of these APIs is not for commercial use. Please purchase a paid tier if you wish to use this script for commercial purposes.

I was lazy and hardcoded my API keys, definitely not best practice. Do yourself a favour and use environment variables instead, like this:  
`VT_API_KEY = os.getenv("VT_API_KEY")`  
It's safer, cleaner, and won’t make future-you cry.

---

## Usage

```bash
python3 OpenScanner.py example.com
python3 OpenScanner.py 8.8.8.8 --verbose
python3 OpenScanner.py http://malicious.url --expand
```

- `--verbose`: show full API JSON responses
- `--expand`: safely trace URL redirects (use in a VM)
	- Just a heads-up: this sends an actual request to the domain, so there’s some risk involved. Please only run this with a VM + VPN combo — don’t go poking shady URLs bare-handed!

---

## Investigation Steps (With OpenScanner)

### Step 1: Triage the Target
- Use **AbuseIPDB** for IP reputation and abuse history
- Use **URLScan.io** to look at screenshots, scripts, redirection
- Ask: Does it look like a normal site? Are there weird or unexpected behaviours?

### Step 2: Reputation Checks
- Use **GreyNoise**, **IPVoid**, **Hunting.abuse.ch**
- Look for tags like `vpn`, `proxy`, `scanner`, `cloud provider`, `residential` or `tor`
- Check blacklists and passive sightings

### Step 3: DNS & WHOIS
- Fetch DNS records: A, MX, NS, TXT, CNAME
- Use **SecurityTrails**, **whois**, **crt.sh**
- Look for:
  - Newly registered domains (<30 days)
  - WHOIS privacy or redacted details
  - Short expiry windows (common for disposable domains)
  - Subdomains or wildcard records

### Step 4: Certificate Transparency
- Use **crt.sh**, **Censys**
- Find SSL cert reuse across suspicious infrastructure
- Pivot from cert to other domains

### Step 5: VirusTotal Graph
- Query IP or domain
- Look for:
  - High detection counts
  - Related samples
  - Behavioral graph activity

### Step 6: Payload Retrieval (Safely)
- **Browserling**: View JS-heavy sites in a sandbox
- `curl -vL` or `--expand` option: Watch redirects


---

## Indicators of a Suspicious Website

| Category   | Red Flags                                                                 |
| ---------- | ------------------------------------------------------------------------- |
| **Domain** | New registration, strange TLD (.zip, .cyou), WHOIS privacy, homoglyph use |
| **IP**     | TOR/VPN detected, cloud-hosted, blacklisted, reverse DNS mismatch, BPH    |
| **URL**    | Shortened links, IP-based URLs, base64 params, large redirect count       |
| **DNS**    | Fast-flux patterns, wildcard abuse, sudden NXDOMAIN spikes                |
| **Page**   | Obfuscated JavaScript, fake login forms, invisible iframes                |
| **Certs**  | Self-signed certs, reused certs across infra                              |

Always defang malicious indicators when sharing them internally.

---

**Quick note on defanging:**  
Always defang malicious indicators when sharing them internally, that’s just good hygiene.  e.g. `http://www.malicious[.]com/bad/path`  

But seriously, you only need to defang the _**top-level domain**_. Please, please, _please_ stop defanging every single subdomain... it’s not only painful to look at, but it also wastes time during testing, scanning, or analysis when we have to refang everything just to make it usable.

---
## Bonus: My Full Cheat Sheet

For more in-depth investigation commands and reference material, check out:

> [IP & Domain Investigation Cheat Sheet](/posts/2025/06/ip-domain-investigation-cheat-sheet/)

Covers:
- `whois`, `dig`, `nslookup` basics
- `curl` flags for headers, tracing, decoding
- IP classes, ranges, and CIDR breakdowns
- Investigation workflows and behavioural signals

---

## Final Thoughts

OpenScanner is a side-project born from need: I was tired of bouncing between tabs. If it saves you time or catches something you might've missed, it’s done its job.

Suggestions, or feature ideas welcome. 

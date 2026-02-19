---
title: "Huntress - Weaponized Velociraptor Delivers Ransomware"
date: 2025-12-03
draft: false
description: "Multi-incident investigation revealing how threat actors, including Storm-2603 ransomware operators, abuse Velociraptor for persistence and C2."
tags: ["threat-hunting", "DFIR", "velociraptor", "external"]
externalUrl: "https://www.huntress.com/blog/velociraptor-misuse-part-two-eye-of-the-storm"
showSummary: true
showDate: false
showReadingTime: false
showWordCount: false
summary: "Investigation uncovered three distinct incidents where threat actors weaponized Velociraptor, a legitimate DFIR tool, for persistent command-and-control access. Attackers exploited SharePoint and WSUS vulnerabilities, installed Velociraptor as a Windows service communicating through Cloudflare tunnels, and deployed secondary tools including VS Code, OpenSSH, and TightVNC. One incident linked to Storm-2603 resulted in Warlock ransomware deployment."
---

![Velociraptor DFIR Tool](velociraptor.webp)

## Investigation Summary

Huntress identified three interconnected incidents where threat actors transformed Velociraptor, a powerful digital forensics and incident response tool, into a malicious command-and-control framework. The investigations revealed sophisticated post-exploitation techniques and shared infrastructure across multiple compromises.

**Attack Methodology:**
- Initial access via SharePoint vulnerabilities (CVE-2025-49706, CVE-2025-49704) and WSUS exploitation
- Web shell deployment in SharePoint directories for persistent access
- Velociraptor installed as Windows service for legitimate-looking C2 communication
- Cloudflare tunnel domains used to mask command-and-control traffic
- Base64-encoded PowerShell commands for evasion
- Deployment of Visual Studio Code, OpenSSH, and TightVNC for redundant access channels

**Key Findings:**
- Multiple incidents shared the same download domain (royal-boat-bf05.qgtxtebl.workers.dev) and Cloudflare infrastructure
- One incident connected to Storm-2603 threat cluster, culminating in Warlock ransomware
- Threat actors made operational errors including failed command syntax and Linux commands on Windows systems
- Creation of unauthorized administrative accounts across compromised environments

**Defense Recommendations:** Organizations should patch SharePoint and WSUS vulnerabilities immediately, establish baseline software inventories, monitor for suspicious Velociraptor instances, and implement comprehensive EDR logging.

[Read the full article on Huntress →](https://www.huntress.com/blog/velociraptor-misuse-part-two-eye-of-the-storm)

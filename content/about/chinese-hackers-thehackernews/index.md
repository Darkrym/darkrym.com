---
title: "The Hacker News - Chinese threat actors weaponizing new tools"
date: 2025-10-08
draft: false
description: "Investigation into Chinese threat actors weaponizing Nezha monitoring tool to deliver Gh0st RAT malware across East Asia"
tags: ["threat-intelligence", "China-Nexus", "open-source", "external"]
externalUrl: "https://thehackernews.com/2025/10/chinese-hackers-weaponize-open-source.html"
showSummary: true
showDate: false
showReadingTime: false
showWordCount: false
summary: "Chinese-linked threat actors compromised over 100 systems across Taiwan, Japan, South Korea, and Hong Kong by weaponizing Nezha, an open-source monitoring tool, to deliver Gh0st RAT. The sophisticated attack chain exploited vulnerable phpMyAdmin panels using log poisoning techniques, deployed web shells via SQL injection, and used the Nezha agent for remote command execution before delivering the final payload."
---

![Chinese Hacker Operations](chinese-hacker.jpg)

## Key Findings

Since at least June 2025, threat actors with suspected ties to China have been exploiting publicly exposed phpMyAdmin panels to compromise systems across East Asia. The attack demonstrates how legitimate open-source tools can be weaponized for malicious operations with plausible deniability.

**Attack Chain:**
- Exploited vulnerable phpMyAdmin panels for initial access
- Used log poisoning (log injection) to plant web shells on servers
- Leveraged SQL commands to execute PHP code recorded in log files
- Deployed Nezha agent to establish remote command and control
- Used PowerShell scripts to disable Microsoft Defender and launch Gh0st RAT

Over 100 victim machines were compromised primarily across Taiwan, Japan, South Korea, and Hong Kong, with the threat actors operating their Nezha dashboard in Russian.

[Read the full article on The Hacker News →](https://thehackernews.com/2025/10/chinese-hackers-weaponize-open-source.html)

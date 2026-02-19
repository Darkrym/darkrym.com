---
title: "BleepingComputer - PXA Stealer to PureRAT Deployment"
date: 2025-10-09
draft: false
description: "Analysis of sophisticated 10-stage attack chain deploying PureRAT, a full-featured commercial RAT with HVNC, keylogging, and surveillance capabilities."
tags: ["malware-analysis", "RAT", "threat-intelligence", "external"]
externalUrl: "https://www.bleepingcomputer.com/news/security/from-infostealer-to-full-rat-dissecting-the-purerat-attack-chain/"
showSummary: true
showDate: false
showReadingTime: false
showWordCount: false
summary: "Vietnamese threat actor behind PXA Stealer has evolved their capabilities, deploying a sophisticated 10-stage attack chain culminating in PureRAT—a commercial .NET remote access trojan. The campaign demonstrates tactical maturity with DLL sideloading, multi-layer obfuscation, in-memory execution, and progression from credential theft to full system surveillance including hidden desktop access, webcam/microphone spying, and real-time keylogging."
---

![PureRAT Attack Chain Overview](attack-chain-overview.webp)

## Attack Chain Analysis

What initially appeared as a standard Python-based infostealer campaign revealed itself as a sophisticated, multi-stage operation deploying PureRAT, a full-featured commercial remote access trojan. The investigation uncovered a Vietnamese threat actor's evolution from amateur operations to deploying commodity malware with advanced capabilities.

**Attack Progression:**
- **Initial Vector:** Phishing email with ZIP archive disguised as copyright infringement notice
- **DLL Sideloading:** Legitimate signed PDF reader executable loading malicious version.dll
- **10-Stage Chain:** Progressive layering of payloads with increasing complexity and obfuscation
- **In-Memory Execution:** Multiple loaders executing entirely in memory to evade detection
- **Defense Evasion:** Multi-layer obfuscation, certutil abuse, and WMI queries
- **Final Payload:** PureRAT with TLS/SSL-encrypted C2 communication

**PureRAT Capabilities:**
- Hidden desktop access (HVNC/HRDP) for undetectable remote control
- Webcam and microphone surveillance
- Real-time and offline keylogging
- Remote command execution
- Application monitoring and manipulation
- Lightweight client with multilingual GUI

**Attribution:** Recurring Telegram infrastructure, metadata linking to @LoneNone, and C2 servers traced to Vietnam strongly suggest this campaign was conducted by the PXA Stealer operators, demonstrating their progression from amateurish techniques to sophisticated, maturing tradecraft.

**Defense Challenge:** The attack's complexity means no single control could stop the entire chain. Organizations must monitor for specific behaviors including certutil abuse, WMI queries, and encrypted C2 traffic to build resilient detection capabilities.

[Read the full article on BleepingComputer →](https://www.bleepingcomputer.com/news/security/from-infostealer-to-full-rat-dissecting-the-purerat-attack-chain/)

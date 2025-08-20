---
author: 
name: Darkrym
date: 2025-06-28
linktitle: Beginner’s Guide to Cyber Security
type:
  - post
  - posts
title: "Getting Started in Cyber Security" 
weight: 10
series:
  - guide
---
## A Guide to Starting in Both Red and Blue Team Operations (Australian Edition)
Cybersecurity is a rapidly expanding and deeply technical field, and it can be difficult to know where to begin. Whether you're a student, a career-changer, or just exploring your interests, this guide aims to provide a comprehensive yet beginner-friendly overview of the core concepts, career paths, and practical steps you can take right now to build your future in cyber security.

---

## Red Team vs Blue Team: Understanding the Two Core Paths

The first decision you’ll want to consider is whether you're more interested in **red teaming** or **blue teaming**. These terms define the two primary functions within cyber security.

Most people are drawn to red teaming because it's exciting and popularised in media. But it’s important to note that **red teaming is difficult to break into without a deep skillset**, and often experience that’s hard to acquire without breaking any laws when starting out.

If you’re just starting, **blue team work is the better entry point**. It teaches you how systems work, how attackers behave, and how to build resilient networks. You can always pivot to red team work later once you understand the defensive side.

### Red Team: Offensive Security

Red teams simulate attacks to uncover security weaknesses. Their goal is to think and act like a hacker, identifying vulnerabilities before real attackers do.

- **Core Activities**:
  - Penetration testing ("pentesting")
  - Social engineering
  - Exploit development
  - Bypassing antivirus and detection systems
  - Bug Bounties
- **Common Tools**: Metasploit, Cobalt Strike, Burp Suite, Nmap
- **Programming Languages**: C (& C++) > PowerShell > Python > JavaScript > VBScript

**Important Note**: Offensive skills require a strong ethical grounding. Writing malware or exploring exploits can quickly cross legal boundaries. Always test in isolated virtual labs you own and operate.

### Blue Team: Defensive Security

Blue teams are responsible for detecting and responding to real threats. They monitor networks, analyse logs, and respond to incidents.

- **Core Activities**:
  - Network monitoring
  - Security operations
  - Digital forensics
  - Threat hunting
  - Incident response and recovery
- **Common Tools**: Splunk/ELK stack, Wireshark, EZ Tools, Flare/Remnux, FTK/Autopsy
- **Programming Languages**: PowerShell > Python > Assembly

Blue team roles offer a more accessible entry point and are often better supported by structured learning and job pathways.

---
## Where to Start

While a cyber security degree can help open doors like internships or entry-level analyst roles these opportunities are rare compared to the number of applicants. Many university courses in Australia are still behind the times: content is often outdated, too theoretical, and misses key practical elements. That said, a degree is sometimes a requirement for roles in government (non-military) and management/leadership positions, so it can still be valuable depending on your career goals.

In all honesty, your time will likely be better spent gaining practical skills, working on real-world projects. If you're considering uni, I recommend first getting some hands-on experience and a couple of certifications under your belt. Build up a solid portfolio whether it's malware analysis, scripting projects, PowerShell tools, or red/blue team utilities. Write a few blog (or LinkedIn) posts explaining what you’ve learned or built; it gets your name out there and shows you're serious.

## My Guide to Developing the Key Skills — The Better Way

Instead of waiting for a uni assignment or outdated course content, take control of your learning and start building real skills now. The cyber security field rewards initiative, curiosity, and hands-on ability far more than just ticking academic boxes. Here’s how I recommend you go about it:

---
### Develop an Understanding Windows Internals and Networking

You don’t need to be an expert, but having a solid grasp of how operating systems and networks function is essential in cybersecurity. This knowledge helps you understand how attacks work, where to look for suspicious activity, and how to design effective defences.

### Windows Internals
- **Logging and Monitoring:** Learn how Windows records system activity through tools like Event Viewer, Sysmon, and Windows Security logs. Understanding what normal looks like helps you spot anomalies.  
- **API Calls and System Interaction:** Study how applications use Windows APIs to perform tasks, how processes communicate, and how attackers might abuse these calls to escalate privileges or maintain persistence.  
- **Common Attack Vectors:** Familiarise yourself with typical Windows attack paths such as Windows Management Instrumentation (WMI), Windows services, registry modifications, scheduled tasks, and DLL injection techniques. Knowing these helps in detecting and blocking malicious activities.

### Networking Fundamentals
- **OSI Model & TCP/IP Stack:** Understand the layered structure of network communications from physical connections up to application protocols. This helps when analysing where and how data flows or is intercepted.  
- **Common Protocols:** Get comfortable with protocols like HTTP/S (web traffic), DNS (name resolution), FTP (file transfers), SSH (secure remote access), and SMB (file sharing), as these are frequently involved in both attacks and normal operations; being able to tell them apart is crucial.
- **Traffic Analysis Tools:** Learn to use packet capture tools such as Wireshark and tcpdump to inspect network traffic. These allow you to identify unusual patterns, malicious payloads, or data exfiltration attempts.

Mastering these basics creates a strong foundation for both red and blue team activities from crafting exploits to building detection rules and ultimately helps you become a more effective cybersecurity professional.

---
### Now for the Cyber Skills

There are countless platforms out there, but here are some of the most effective and affordable options to get hands-on experience, learn real-world skills, and build your cyber skills:
### Hands-On Labs
- **[Hack The Box](https://www.hackthebox.com/)**  
  - Industry-recognised virtual labs and certification pathways.  
  - Offers a 14-day free trial and student discounts. Great for developing offensive and defensive skills.
  - Their **CDSA** certification is highly regarded for entry-level SOC positions.

- **[TryHackMe](https://tryhackme.com/)**  
  - Perfect for beginners with guided learning paths.  
  - Gamified and browser-based labs make learning interactive and fun.

- **[TCM Security Academy](https://academy.tcm-sec.com/)**  
  - Offers semi-affordable, practical courses covering real-world techniques.  
  - Their **PNPT** certification is highly regarded for entry-level red teamers.

### Theoretical Courses
- **[CompTIA Security+](https://www.comptia.org/certifications/security)**  
  - A foundational cert that covers key cyber concepts.  
  - Even if you don't take the exam, studying the content gives you a strong baseline.

- [**Google Cybersecurity Certificate**  ](https://grow.google/certificates/en_au/certificates/cybersecurity/)
  - A beginner-friendly option that introduces you to key concepts.  
  - More suited for general IT/cyber foundations, but a decent starting point if you're just entering the field.

## All Things Cyber Certifications

Use this map to plan your learning path, compare options, explore what excites you at your current skill level, and find your next goal. Continuously conduct SWOT analyses of your skill set and plan your next steps accordingly.

- **[Paul Jerimy's Certification Roadmap](https://pauljerimy.com/security-certification-roadmap/)**  
  - One of the best resources to get a full picture of the certification landscape.  
  - Covers everything from entry-level to expert certs, organised by skill domain and difficulty level.  
  - It can look overwhelming at first, but take the time to explore, there’s something in there for everyone, no matter where you're at in your journey.

### Video Guides

For the visual learners these videos are packed with great advice on structuring your own learning path. Great if you're unsure where to begin or just want to sanity check your own plan.

- **[The Hacker’s Roadmap – How to Get Started in 2025](https://www.youtube.com/watch?v=some-link)**  
- **[How I Would Learn Cyber Security in 2025](https://www.youtube.com/watch?v=some-link)**  
---
## Bonus Skills: Programming for Cyber Security

Programming is an essential tool in your cyber toolkit. Whether defending systems or testing their limits, being comfortable with code enables you to automate workflows, develop custom tools, analyse malware, and simulate real-world attacks or defences.

If you want that leg up over the entry-level competition start creating a **portfolio** to showcase your programming skills. Pick a programming language (or two) from the lists below and develop a new project. This will also help you develop and improve your own skills, the best way to learn is simply to start doing it. Cybersecurity is all about teaching yourself, experimenting, and constantly improving.

Here are some starter ideas to get you going. Once you’ve built something, upload it to a **public GitHub repository**. Sharing your work not only helps you secure a job but also strengthens the whole cybersecurity community by developing open-source tools, making it harder for hackers to succeed.

---
### For the Blue Team:

**Priority Programming Languages:**  
- **PowerShell**: Key for automating incident response tasks, querying system info, managing services, and detecting persistence on Windows systems.  
- **Python**: Ideal for just about everything, from log parsing, threat hunting, malware analysis, querying threat intel APIs, and building dashboards or automation tools.  
- **Assembly**: Important for understanding malware at the binary level; this is a hard skill to master but makes you invaluable for reverse engineering suspicious code.

**Blue Team Project Ideas:**  
- **Active Directory Audit Script**: Use PowerShell to enumerate users, groups, privileges, and trust relationships, automating detection of misconfigurations or privilege escalations.  
- **PDF Malware Scanner**: Develop a Python script that scans PDF metadata and embedded objects for signs of malicious content.  
- **Deobfuscation Tool**: Build a script to decode common obfuscation methods adversaries use, such as base64 or hex encoding, to reveal hidden commands or code.  
- **IP/Domain Scanner**: Create a tool that enriches IP addresses or domains with public data like WHOIS, geolocation, and reputation to quickly assess potential threats.

---
### For the Red Team (Offensive Security):

**Priority Programming Languages**:  
- **C / C++**: Critical for writing custom implants, loaders, and interacting directly with system APIs or developing offensive tooling like DLL injectors.
- **PowerShell**: Still widely used for in-memory execution, post-exploitation modules, and lateral movement, especially with frameworks like PowerSploit or Empire.
- **Python**: Useful for scripting exploits, writing custom C2 clients, or prototyping offensive tools.
- **JavaScript**: Key for client-side attacks such as XSS, HTML smuggling, and web exploitation.
- **VBScript**: Though outdated, it’s still viable for crafting phishing payloads or for bypassing signature-based defences in older environments.

**Red Team Project Ideas**:
- **Custom C2 Framework**: Build a lightweight C-based command-and-control client that uses encrypted beaconing.
- **In-Memory Loader**: Create a PowerShell script that fetches and executes shellcode in memory (e.g. using `Invoke-Expression` or `Reflection`).
- **JavaScript Payload Generator**: Write a tool that generates obfuscated JS payloads for testing XSS filters.
- **Macro Dropper Builder**: Combine VBScript and PowerShell to deliver payloads via Office macros in simulated phishing engagements.

---
### Combine Skills in Practical Projects:

Blending defensive and offensive perspectives leads to a deeper understanding of threats and mitigations.

- **Event Log Anomaly Detector**: Develop a PowerShell script that flags anomalous logon attempts or service installations based on baselines, then practice developing malicious scripts which avoid triggering any alerts or remove any traces it leaves in logs.
- **C2 Detection Emulator**: Write a basic C2 and find it with WireShark then build a corresponding detection rule set.
- **Signature Development and Bypass**: Use your knowledge of malicious code to identify common patterns in Dropper then build YARA/Sigma rules for detection, then creating your own unique dropper to bypass it.

---

Developing tools like these not only solidifies your technical skills but also demonstrates practical capabilities crucial for portfolios, team contributions, and advancing in both offensive and defensive roles.

Now its time to start applying for job!

---
## Working in Australian Cyber Security

Getting a start in cyber can be difficult but starting the the Government or Military sectors can help you break into the industry.

In Australia, much of the government-focused cybersecurity work falls under the **Australian Signals Directorate (ASD)**, which plays a central role in protecting national security through cyber defence and intelligence operations.
### Blue Team: ACSC
- The **Australian Cyber Security Centre (ACSC)** is the defensive arm of ASD.
- They secure Australian businesses and government departments from cyber threats.
- Lots of cadetship or early career opportunities will be in the ACSC.
### Red Team: Offensive Operations
- While more exclusive, ASD's red team has conducted major operations against criminal and state-based actors.
- Two major declassified operations include:
  - [How intelligence agencies catch criminals | ABC News](https://youtu.be/j6S4_cZswWE?si=e1d15ALDrPP4aAbG)
  - [How Australian spies tracked down Russian cyber-gang | 9 News Australia](https://www.youtube.com/watch?v=E9i_BPr13kE)

Other key players include:  
- **Australian Federal Police (AFP)**: Responsible for investigating cybercrime and enforcing cyber laws across Australia.  
- **Australian Defence Force (ADF)**: The ADF includes specialised cyber capabilities tasked with cyber operations to protect military assets and support national defence objectives. This is where I cut my teeth, while it’s not for everyone, if you can handle the military environment, it’s an excellent way to receive world-class training. If you considering joining I would encourage you to go with the Air Force as it has the most developed cyber capability within the ADF.

---
## Final Thoughts: Building Your Cyber Future

Cyber security combines creativity, problem-solving, and technical skill. You don’t need to know everything to begin, but consistency and curiosity will take you far.

### Quick Start Checklist:
- Decide if you want to focus on Red Team (offence) or Blue Team (defence)  
- Study Windows internals and networking fundamentals  
- Start a beginner-friendly lab like Hack The Box or TryHackMe  
- Learn a scripting language such as Python or PowerShell  
- Build and publish small projects (e.g., log parser, PDF scanner)  
- Explore certification roadmaps and create a career plan.

My final recommendation is to do everything you can to work towards certifications like CompTIA Security+ and the Hack The Box CDSA. It’s challenging, but if you succeed, you’ll be far more valuable than any fresh uni graduate in a SOC environment.

Remember: start simple, stay ethical, and always keep learning.

Got questions or want feedback on your learning path? Drop me an email — I’m always happy to chat.

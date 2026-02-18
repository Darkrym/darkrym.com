---
author:
  name: Darkrym
date: 2026-02-17
linktitle: Investigation_Theory
type:
  - post
  - posts
title: "Speed vs Depth: The Art of Investigation Theory in the Real World"
weight: 10
series:
  - guide
  - investigation
  - deep_dive
---

![image](/pictures/investigation_theory.png)

## Introduction

In my world of Managed Detection and Response (MDR), there's a fundamental tension that shapes every investigation: the need for speed versus the desire for depth. Unlike traditional digital forensics where you have the luxury of time to meticulously reconstruct every detail, MDR investigations operate under a different constraint. We need to move fast, contain threats, and prevent further damage. We don't have time for forensics outside of purely what we need for the next step.

Working at an MDR company has shifted my mindset from my previous forensics-focused workplace. Previously I'd chase down leads for days at a time, often only to find they led nowhere. But I quickly learned that great MDR investigation isn't about being the most thorough investigator in the room. It's about being the most efficient one. It's about knowing exactly what questions to ask, what evidence matters right now, what you can safely ignore, and what's that next piece of evidence you need to uncover. It's about understanding when "good enough" is actually good enough, and when you need to dig deeper.

This isn't a guide to digital forensics. This is a guide to investigation theory in the real world, where the clock is ticking, the attacker might still be in the environment, and your client is ringing you for answers.

---

## The Foundation: What is Investigation Theory?

Before diving into my approach, let's establish the fundamentals. Investigation theory isn't new, some of these techniques as old as time itself. The frameworks below are the "by-the-book" answers you'll find in certifications and compliance policies. They're not where I put my focus (we'll get to my approach later), but they form the foundation that everything else builds on. Understanding these traditional methods gives you a vocabulary and mental models that make you a better investigator, even when you're compressing them down to fit MDR timelines. 

### Traditional Criminal Investigation Methods

**Locard's Exchange Principle** - Every contact leaves a trace. The perpetrator always leaves something at the scene and takes something away. In cyber terms, every action leaves logs, artifacts, or changes.

**Abductive Reasoning** - Start with observations and form the most plausible hypothesis. Not certainty, just the best explanation given current evidence. This is how we build theories about what happened.

**The Investigation Process** - Data collection and analysis form the foundation. Gather information from various sources (witnesses, documents, physical evidence) to support or refute theories, rinse and repeat until there is one hypothesis left standing.

### Cyber Investigation/Incident Frameworks

**NIST Four-Phase Cycle** - Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity. It's cyclical, not linear - continuous learning and improvement.

**SANS Six-Phase Model** - Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned. More granular breakdown of the response lifecycle.

**DFIR Methodology** - Digital Forensics and Incident Response combines evidence preservation (forensics) with active threat response (incident response). Collect, preserve, analyse, document.

### The Reality

In MDR, we cherry-pick from all of these. We use abductive reasoning to form quick hypotheses. We follow NIST/SANS phases but compress them - a lot. We do forensics only when it serves the investigation. Every technique is a tool, not a religion.

---

## So What's My Theory?

My investigation framework combines two concepts:

### Part 1: Kill Chain Analysis

The key to this is to constantly be mapping where the attacker is in their progression. This determines what evidence matters right now and what your next move should be. If you've found initial access, you're looking for lateral movement or persistence. If they're at impact but don't know how they got there, you need to contain and find the initial access.

Every piece of evidence you find should be a puzzle piece that clicks into place in one of the following stages of the Cyber Kill Chain.

1. **Reconnaissance** - Gathering information about the target
2. **Weaponization** - Creating malicious payloads
3. **Delivery** - Transmitting the weaponized content
4. **Exploitation** - Taking advantage of vulnerabilities
5. **Installation** - Installing malware on the system
6. **Command and Control (C2)** - Establishing remote control
7. **Actions on Objectives** - Achieving the ultimate goal (exfiltration, destruction, etc.)

> Note: some people prefer the [MITRE ATT&CK](https://attack.mitre.org/) tactics, I like the [Lockheed Martin Cyber Kill Chain](https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html), find which works best for your brain!

Every piece of evidence we find can be placed into one of these phases. The more of the chain we piece together, the clearer the picture becomes. Each artifact is a puzzle piece: a PowerShell execution might be exploitation, a scheduled task could be persistence, unusual network traffic points to C2. As you map evidence to stages, gaps become obvious. Missing the initial access vector? You know what to hunt for. Found C2 but no persistence? Time to look for how they're maintaining access.

Once you join up all these puzzle pieces, you don't just have answers, you have the complete attack narrative. You understand not just what happened, but why each step occurred and what the attacker was trying to accomplish.

### Part 2: Likelihood vs Impact Analysis

That might sound familiar if you've ever done business risk assessments, because this is exactly how we do risk assessments, but in this case applied to investigation decisions. For every piece of evidence or avenue of investigation, ask:

- **Likelihood** - How probable is this theory? Does it fit the evidence? Is this a common attacker behavior or sys admin?
- **Impact** - If this theory is correct, how bad is it? What's at risk? What damage could occur?

#### Understanding Likelihood

Likelihood increases as you build out the kill chain. Found a single suspicious PowerShell command? Could be anything. But when you find that PowerShell command, then a scheduled task creation, then outbound C2 traffic, then lateral movement attempts, the more complete your chain, the higher the likelihood this is bad.

But here's where I've made mistakes: **trust your gut, but don't ignore it for too long**. This is the "sniff test."

I've spent too much time trying to find the smoking gun to prove something malicious, only to eventually convince myself "this has to be a sysadmin doing weird stuff, right? They're always doing weird things." Then later, it turns out it was malicious. If something doesn't pass the sniff test and there's a chance of high impact, do something about it.

Better to be wrong and have isolated a sysadmin's machine for 20 minutes than to ignore your instincts and let an attacker continue lateral movement while you chase perfect certainty. Your gut (experience and pattern recognition) are part of the likelihood calculation too.

#### Understanding Impact

Impact isn't a simple yes/no. It's multiplicative. Every dimension amplifies or reduces the severity. These factors stack on top of each other to determine how urgent your response needs to be.

The impact multipliers matter:
- **Who**: Standard user vs local admin vs domain admin
- **Where**: Single endpoint vs multiple hosts vs critical infrastructure (DC)
- **What**: Information access vs credential theft vs persistence vs data exfiltration
- **Scope**: Isolated incident vs active lateral movement vs environment-wide compromise

Think about how these multiply together. A standard user on a single workstation accessing some files? Low impact across all dimensions, isolated, limited access, minimal damage potential. But a domain admin account doing enumeration of sensitive data on your domain controller? Maximum impact. You've got the highest privilege level (Who), on the most critical system (Where), with reconnaissance activity suggesting they're planning next steps (What), and the potential for full domain compromise (Scope). Every multiplier is maxed out. That's when you drop everything.

#### Combining Likelihood and Impact

Your response urgency should match the combination of these factors.

- **High likelihood + High impact = investigate immediately.** This goes to the top of your pile. Drop everything.
- **High likelihood + Low impact = quick check, move on.** Contain it, verify no lateral movement, document it, move on.
- **Low likelihood + High impact = keep monitoring.** Set up monitoring, document your concerns, but don't burn hours chasing shadows yet.
- **Low likelihood + Low impact = deprioritize.** These can hopefully be safely ignored while you respond to higher priority items.

#### Quick Reference Matrix

|                     | **High Impact**                                                                                     | **Low Impact**                                                      |
|---------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| **High Likelihood** | **Investigate immediately**<br>Drop everything, this is urgent                                      | **Quick check, move on**<br>Contain, verify scope, document, done  |
| **Low Likelihood**  | **Keep monitoring**<br>Set up monitoring, document concerns, don't chase shadows                    | **Deprioritize**<br>Note it, move to higher priority items         |

### Why This Works in MDR

The kill chain gives you direction. The likelihood/impact matrix gives you prioritization. Together, they let you make fast, defensible decisions about where to spend your limited investigation time.

Remember you're not trying to reconstruct every detail like a forensics analyst would. You're not building a perfect timeline of every action. You're trying to understand enough to make the right next decision: Do we contain now? Do we escalate to the client? Do we keep investigating to fill critical gaps? Each piece of evidence should inform that decision, not just add to a complete picture for its own sake.

---

## Final Thoughts

Investigation theory in MDR isn't about following a framework perfectly. It's about understanding the principles well enough to know which ones matter right now, in this investigation, for this decision.

The kill chain tells you where you are in the story. Likelihood and impact tell you how urgently you need to act. Together, they create a mental model that lets you move fast without being reckless, and be thorough without wasting time.

The best investigators I know don't have perfect recall of every framework. They have strong pattern recognition, they trust their instincts, and they know when "good enough" is actually good enough. They understand that in MDR, your job isn't to answer every question, it's to answer the right questions fast enough to matter.

So next time you're staring at a suspicious alert, ask yourself: Where in the kill chain are we? How likely is this to be malicious? If it is, what's the impact? Then make your call and first move.

The clock is always ticking. Make your decisions count. And Finally Stay Curious Folks!

---

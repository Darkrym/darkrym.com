---
author:
  name: Darkrym
date: 2026-03-14
linktitle: ai_workflow
type:
- post
- posts
title: "When the Doers Become Makers - 'Vibe Coding' Done Right"
weight: 10
tags:
  - guide
  - ai
  - development
  - workflow
series:
  - Basics
series_order: 1
summary: Solving operational friction points with a team of analysts powered by AI-assisted coding. Layered context, guided workflows, and systematic debugging that let non-developers ship production-quality code.
featureimage: https://darkrym.com/pictures/ai_workflow.png
---

## The Maker's Itch

I've always loved building things, 3D printing, metalwork, woodworking, anything that involves creating something with your own hands, taking an idea and making it real. But code was never part of that. I'd write scripts begrudgingly to automate something annoying or enable me to achieve something cool, but I hated dev work.

I could always program. I'm just slow and spend more time remembering how than actually building. Ideas were never the bottleneck. Implementation overhead was.

Mid last year, that changed. I found the same maker satisfaction in code.

People call it "vibe coding", but I hate that term. It suggests you're being unserious, vibing through without understanding what's happening. That's exactly the wrong way to do it, and exactly why most AI-assisted coding projects eventually fail.

Good AI-assisted development uses AI to handle syntax and boilerplate while you make architectural decisions, review output critically, and understand what the code does. You're still the builder. The AI is a power tool, not a replacement for getting into the code yourself.

---

## The Gap Between Knowing and Building

Security analysts know exactly what would make their jobs easier. They spend eight hours a day hitting the same friction points, wishing the interface worked differently. But knowing what you need and building it are different skills. The traditional path is to submit a feature request, then wait, more waiting, maybe six months, or maybe never. As gathering requirements can be a challenge capturing exactly what's needed, when it's needed, without losing momentum to delays or competing priorities.

That's when I remembered, we had a browser extension for enhancing workflows, but it had basic functionality, no documentation, and remained untouched for months. So I rebuilt it from the ground up. Modular architecture, tonnes of documentation, extensible by design.

Management saw the potential and enabled it. The extension became a pipeline for getting changes into the platform, a testing ground at scale. Ideas that proved valuable here inform actual product development. This allows for rapid iteration, real-time user feedback, and minimal risk. Let me make this clear: we are not deploying code into production, instead we have a middle layer that sits in-between the analyst and the product, which is easy to disable if something breaks.

The key idea: what if the people who understand the problem best could build the solutions themselves?

---

## The System That Makes It Work

Over the last six months, I've continually reassessed that idea, figuring out how to shape my workflow around AI-assisted coding in a manner that could be replicable by my teammates. Everyone will generally hit the same friction points, but the strength of a team comes from each individual's unique perspective and approach to solving the problem.

### What Non-Developers Actually Need

With recent improvements in AI-assisted coding, analysts don't need to understand the implementation. The primary challenge I've found is in describing with clarity what they want the AI to build.

Clear and structured prompts are highly effective; templates that scaffold the conversation: "The module should [X], run on [pages], display as [type], with settings for [Y]."  By using this or a similar format, we fill in the blanks and give the AI enough context.

Similarly, we focus on debugging strategies rather than debugging skills. Gather information (check console, describe expected vs. actual behavior), communicate it clearly. The AI handles the actual bug fixes.

All this is buffered with guardrails. The module system sandboxes their work. This allows us to build features, not infrastructure, while the architecture absorbs mistakes safely.

A caveat here: Basic code literacy is still important. Not at a level to write code from scratch, but rather to be able to read it well enough to say "this part handles the click" or "this condition seems wrong." Similar to how a pianist doesn't necessarily need to be able to create sheet music from scratch to play a melody, they need to be able to read and identify which sections are wrong.

### Layered Context

This all comes down to one word: context.

Out of the box, an AI assistant knows nothing about any of this. It doesn't know the architectural patterns, the utility libraries, or the conventions. It will generate code that's technically correct but stylistically wrong, code that doesn't fit.

SO we need to teach it, but there's a constraint, the dreaded context windows. AI models can only hold so much information at once. You can't just dump your entire codebase and all your documentation into every conversation. The context would overflow, the model would lose focus, and you'd burn through tokens unnecessarily.

The solution is layered context, information structured so the AI loads what it needs, when it needs it:

```
┌───────────────────────────────────────────────────┐
│              LAYERED CONTEXT SYSTEM               │
├───────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐              │
│  │   Layer 1: Project Context      │              │
│  │   CLAUDE.md (Always loaded)     │              │
│  └───────────────┬─────────────────┘              │
│                  ▼  Loaded as needed              │
│        ┌───────────────────────┐                  │
│        │ Layer 2: Reference    │                  │
│        │     Skills            │                  │
│        └───────────┬───────────┘                  │
│                    ▼  /create, /release, /debug   │
│        ┌───────────────────────┐                  │
│        │ Layer 3: Executable   │                  │
│        │     Skills            │                  │
│        └───────────┬───────────┘                  │
│                    ▼  "Don't do this again"       │
│        ┌───────────────────────┐                  │
│        │ Layer 4: Lessons File │                  │
│        │   (tracked mistakes)  │                  │
│        └───────────┬───────────┘                  │
│                    ▼  Still confused?             │
│        ┌───────────────────────┐                  │
│        │  Layer 5: Human Docs  │                  │
│        │  (guides, references) │                  │
│        └───────────────────────┘                  │
└───────────────────────────────────────────────────┘
```

**Layer 1: Project Context Files** - The foundation. A markdown file in the project root that loads automatically at the start of every session. It contains the project overview, critical patterns, and pointers to deeper documentation. Every conversation starts with this context already in place.

Other tools: Claude Code uses CLAUDE.md, Cursor uses .cursorrules, GitHub Copilot uses .github/copilot-instructions.md.

But my file quickly got too large for an AI to handle efficiently, which is why the other layers exist.

**Layer 2: Skills (Reference)** - Markdown files in the .claude/skills/ directory that provide focused documentation on specific topics. Architecture overviews, coding patterns, UI/UX guidelines, utility references. The AI loads these as needed based on the task at hand. They're more detailed than the root context file but still static knowledge.

Other tools: Cursor has .cursor/skills/, GitHub Copilot uses .github/skills/. The skill format is becoming an open standard across AI tools.

**Layer 3: Skills (Executable)** - Subdirectories within .claude/skills/*/ that contain SKILL.md files defining interactive workflows. A /create skill asks structured questions about requirements, checks the utility library, and generates properly structured module files. A /release skill runs pre-release verification: checks conventions, audits for code duplication, validates security patterns, generates PR templates. A /debug skill systematically troubleshoots common issues. These encode process knowledge into repeatable, triggered workflows.

Claude is a little different here; this is what you would call an "Agent" in other tools. I prefer this way of doing it as standalone agents are too hyper-specialised in my experience.

**Layer 4: Lessons File** - A dedicated file for tracking AI mistakes and corrections. When the AI makes an error I've corrected before, it will add it to .claude\LESSONS.md. The AI reads this file and hopefully stops repeating those mistakes. Your project context tells AI what to do; your lessons file tells AI what not to do.

This doesn't prevent the same mistake 100% of the time, but the file gets updated by all users of the workflow, allowing me to identify patterns and update the project context or skills to avoid problems entirely.

**Layer 5: Human Documentation** - The same documentation that helps humans understand the project also helps the AI. Module creation guides, utility references, and pattern libraries are all written once and consumed by both humans and AI. The AI is specifically instructed to check the utility reference before writing new code, preventing reinvention. This layer is tool-agnostic; it's just good documentation that happens to be machine-readable.

When someone opens a session to build a module, the AI already knows the architecture. It knows the conventions. It knows where to look for existing functionality before writing new code.

You bring domain expertise, the AI handles implementation, and the documentation keeps everything aligned.

---

## From Idea to Production

Here's what the actual workflow looks like for someone who has limited programming knowledge but deep domain expertise.

### Step 1: Describe what you want

Not pseudocode. Not technical specifications. Just run /create with a clear description of the problem and desired solution:

"I want to create an interactive process map that visualizes running processes on an endpoint. Show parent-child relationships as a tree, highlight processes with alerts in red, and let me click a process to see a full breakdown of process details and lineage."

### Step 2: Answer clarifying questions

The AI walks through structured phases: module basics (name, which pages it runs on), UI approach (inline badges, collapsible panel, modal dialog), settings configuration (what should users be able to customize), and API integration (which existing utility functions to use). It checks the utility library first and presents relevant functions: "I found fetchAgentSurvey() for getting process data and getAgentId() for context" This isn't the human learning to think like a developer, it's the AI gathering requirements in plain language while preventing code duplication.

The goal is one-shotting, which means gathering enough context that the AI can generate a complete, working module in a single pass. This results in fewer bugs, less duplicated code, and more coherent implementations. When the AI knows all the functions it needs upfront, the result is cleaner. When it understands the full data flow, it structures the code more logically. The Q&A takes a few minutes but produces a much better solution overall without the need for too much back and forth.

### Step 3: Review what gets built

The AI summarises the configuration for approval, then generates the module files following project conventions. Configuration file, JavaScript logic, styles for both light and dark modes, registered in the index. Then the human reviews the output; this is where basic code literacy matters, not writing code, but reading it well enough to spot when something looks off.

### Step 4: Test and iterate

Load the resulting code, try it out, and describe what's not working IN DETAIL. "The tree renders, but when I click on the parent node, the details panel doesn't show," or "I'm seeing an error in the console that says, X, it triggered in line Y of file Z."

The AI uses systematic debugging: adding diagnostic logging to trace execution flow, checking if DOM elements actually exist, and printing data at key comparison points to see what the code has versus what it expects. Logging is key here, it's the easiest way to communicate issues back to the AI. The AI knows where it placed the log statements and what it expects to see. You test it, return the logs, and it can figure out exactly where things went wrong.

### Step 5: Pre-release verification

Before shipping, /release runs verification loops: tests, visual checks in light and dark modes, security review, convention compliance, dead code audit, and a check for reinvented utilities. If anything fails, it lists specific issues. Fix, re-run, repeat until it passes. Then it generates a PR template documenting what was built and tested.

### Step 6: Submit for review

The module undergoes human review before being deployed to the entire SOC. But by this point, it's already following project conventions, passing quality checks, and working correctly. The PR template documents everything the reviewer needs to know.

This allows the entire path from "I wish this existed" to "it's deployed" can happen in a day or two.

---

## What Actually Changed

Six months in, I watched multiple analysts who'd never written code ship modules that fixed QOL issues we'd been waiting on for years. They described what they wanted, answered questions about the workflow, reviewed what got built, and iterated until it worked. The first module took a couple of days, but from there, they could spin up fixes in an afternoon.

They didn't learn JavaScript. They learned to effectively prompt AI through guided workflows, describing problems clearly, and read code well enough to spot when something looks wrong. That's it.

The modules that emerged weren't on any roadmap. Small enrichments that surfaced data analysts' missing data, a subtle indicator made the missing data obvious, and a buried field was pulled to the top. Workflow automations that collapsed multiple manual steps into one click. Investigation timelines with inline statistics that sped up cases. Templates and checklists that pre-fill documentation and guide newer analysts. Operational tooling, availability tracking boards, and in-depth queue health stats let SOC leadership manage capacity on the fly.

All of it came from people who understood their workflows intimately and finally had a way to act on that understanding.

The gap between knowing what you need and being able to build it used to require years of programming knowledge. Now it requires structured workflows, clear communication, and basic code literacy. The person who feels the problem most acutely can build the solution.

The best tools come from people who feel their absence most acutely.

---

## Further Reading

These shaped how I think about AI-assisted development:

- [Building Claude Code](https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny) - Boris Cherny approach
- [Boris Chery's Workflow](https://x.com/bcherny/status/2007179832300581177?s=20)
- [Fr0gger's AI Advent](https://blog.securitybreak.io/genai-x-sec-advent-2025-edition-32c52ff753b4) - Domain-specific AI workflows for security
- Advanced Reading: [Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04) - Actually, just go read all of [Steve Yegge](https://steve-yegge.medium.com/)'s work!

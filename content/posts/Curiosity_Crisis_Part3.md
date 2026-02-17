---
author:
  name: Darkrym
date: 2026-01-24
linktitle: Curiosity_Crisis_Part3
type:
  - post
  - posts
title: "Learning in the AI Era - Part 3: Practical Workflow with NotebookLM"
weight: 10
series:
  - guide
  - learning
  - ai
  - deep_dive
---

## Introduction

In [Part 1](/posts/2026/02/learning-in-the-ai-era-part-1-the-curiosity-crisis/), we established that curiosity is a muscle and that AI isn't inherently making us stupider, it's just making our atrophied curiosity more visible. In [Part 2](/posts/2026/02/learning-in-the-ai-era-part-2-the-learning-cycle/), we explored the learning cycle framework and why understanding how learning works matters before using AI as a study tool. Now we get practical.

This post walks through a specific workflow I've been using with Google's NotebookLM to apply evidence-based learning strategies. This isn't the only way to do it, but it's a concrete starting point you can adapt to your own learning style. We'll explicitly map each technique to the three phases of the learning cycle (Understanding, Remembering, Focusing) so you can see how they fit together.

---

## NotebookLM

I've been using ChatGPT, Claude, and Gemini for years now, but NotebookLM was something I hadn't explored until recently when I signed up for [free Gemini Pro](https://gemini.google/us/students/?hl=en) access through my student email. The key differentiator was NotebookLM is grounded in the sources I provided. You feed it documents, PDFs, websites, or text, and it responds based on that content, it doesn't seem to pull from its general training data the way ChatGPT or Claude does.

The result is dramatically less hallucination, more focused responses, and better accuracy for domain-specific material. When you're studying for a certification or learning a specific framework, you don't want the AI making stuff up or conflating concepts from different methodologies. NotebookLM isn't perfect, but for studying specific material, it's been a game-changer.

---

## Step Zero: Source Quality Matters

Before you do anything else, you need quality sources. For me, this meant scraping content from my cybersecurity training platform (and yes, **please training providers, just give us downloadable content** the live access model actively hinders your students). For students at school/uni this is where I'd upload all your course content along with the rubric and learning outcomes for your subject as you want it to test you on the same things you be tested on IRL. You *can* supplement it with external resources: relevant blog posts from trusted sources, official documentation, research papers, and community resources.

> Do your due diligence on external sources. Look for author credibility, current publication dates, peer review or community validation, and consistency with official documentation. Garbage in equals garbage out for AI as NotebookLM will confidently work with whatever you feed it.

---

## The Workflow: Integrating the Learning Cycle

> Quick Note: Everyone learns differently. This workflow is a starting point, spend some time experimenting with what works best, go back to the chart in the previous post to make sure you're hitting all three phases of the learning cycle. Let me walk through how I use NotebookLM for each phase.

![image](/pictures/curiosity_crisis/main.png)

---

## Phase 1: Understanding - Scoping with Mind Maps

**Goal**: Get a big-picture overview of how topics relate and identify where your knowledge is weak.

Once you've loaded your sources into NotebookLM, use the "Studio" feature to generate a mind map. This gives you a visual overview of the topic landscape—you can see how concepts connect at a glance, click on any node for details, and quickly identify areas where you have strong versus weak understanding.

**My approach**: I breeze through areas where I'm already comfortable and focus on areas where I don't have clear answers. This is scoping the subject—building a mental map of the terrain before diving deep into any single area.

![image](/pictures/curiosity_crisis/mind map.png)

---

## Phase 2: Remembering - Baseline Quiz

**Goal**: Activate active recall and establish a baseline for measuring improvement.

Once you've identified a weak area, create a practice quiz before studying it in depth. In NotebookLM Studio, click the pencil icon to customise your quiz generation with a detailed prompt like this:

```
Create a quiz to test my knowledge of [specific topic] before I spend focused study time on it.

Context:
- Exam/rubric specifies these outcomes: [list 1, 2, 3]
- Focus on practical application, not just definitions
- Include scenario-based questions where I need to make decisions

Difficulty: Intermediate (I have foundational knowledge but need to strengthen application in realistic scenarios)
```

Take the quiz and note your results. Don't beat yourself up over wrong answers—this is your baseline. You're supposed to struggle here. The act of attempting to recall information (even when you get it wrong) primes your brain for learning.

![image](/pictures/curiosity_crisis/quiz.png)

---

## Phase 2: Remembering - Audio Learning (First Pass)

**Goal**: Get a conversational understanding of the topic using your preferred learning modality.

NotebookLM's "Audio Overview" feature is invaluable for audio learners. Generate a 30-minute or less audio overview with a prompt like:

```
Generate an audio overview of [specific topic] covering:
- High-level concepts and why they matter in .....
- How different subtopics relate to each other
- Real-world applications
- Common misconceptions or gotchas that catch people out

Focus on clarity over completeness, I'll dig deeper on specific areas in follow-up sessions.
```

**Critical step**: While listening, take notes on things you don't fully understand. Research shows handwriting improves retention compared to typing because it forces you to process and summarise rather than transcribe verbatim, so I use a physical notebook for this stage. Complete the full overview before moving on, resist the urge to pause and research every question, just jot them down for now.

![image](/pictures/curiosity_crisis/audio_prompt.png)

---

## Phase 2: Remembering - Flashcards for Gaps

**Goal**: Target specific weaker subtopics with spaced repetition material.

Take those notes from the audio overview and turn them into flashcards with a prompt like:

```
Create flashcards for these specific concepts I need to strengthen:
[List the concepts you noted down]

Format requirements:
- Front: Scenario-based question or real-world situation              <- This will change depending on your use case
- Back: Answer with brief explanation of WHY, not just WHAT
- Include context for when this matters
- Link to related concepts/chapters where relevant (help me build mental models, not isolated facts)

Focus on understanding over memorisation. I should be able to explain each concept to someone else after reviewing these.
```

Review these using spaced repetition i.e. just review them with increasing intervals: same day, next day, 3 days out, week out.

![image](/pictures/curiosity_crisis/flash_cards.png)

---

## Phase 2: Remembering - Deep Dive Audio (Interleaved Practice)

**Goal**: Go deep on specific subtopics you are still struggling with whilst switching up your learning technique.

For each concept you noted down, generate a focused audio deep dive:

```
Create a focused 15 minute audio deep dive on [specific concept].

Cover:
- What it is, with concrete examples from real life
- Why it matters in the context of .....
- How it relates to [broader topic from the mind map]
- Common pitfalls or misunderstandings
- Practical application: How would I use this right now?

Assume I have basic familiarity but need deeper understanding. Include at least two realistic scenarios where this concept is critical.
```

This is **interleaved practice** in action. You're switching between different learning techniques (audio → flashcards → audio → quiz) rather than doing just one thing for hours. Research shows this improves long-term retention because it keeps your brain engaged and prevents the effectiveness decay that comes from repetitive practice.

---

## Phase 3: Focusing - When and How to Take Breaks

**Goal**: Maintain effectiveness by managing your attention and energy.

Study effectiveness decreases over time, your attention is a finite resource. Recognise the signals, if you are getting distracted by unrelated thoughts, re-reading the same sentence without comprehension, feeling strained rather than challenged, or making careless mistakes on things you know. When you notice these, take a break.

- **Pomodoro Technique** (if you're naturally distractible like me lol): 25 minutes focused study, 5 minute break, and after 4 cycles take a longer 15-30 minute break. 
- **Motivation-based** (if you're in a flow state): Keep going as long as you're feeling effective, don't force yourself to stop if you're in the zone.

When you do take a break keep in mind **Dopamine management**, step outside for fresh air/sun, have a snack, do brief physical activity, or have social interaction. Don't do social media (rabbit hole), gaming (hard to stop), or anything requiring deep focus. The goal is to reset your brain and reward it for studying, the right kind of break makes you want to get back to learning.

---

## Now it's time to repeat the cycle - Measuring Progress

## Phase 2: Active Recall Test (Measuring Progress)
**Goal**: Measure improvement and identify remaining gaps.

After working through flashcards, audio deep dives, and practice, generate another new quiz slightly harder than your baseline:

```
Create a practice exam for [topic] that's slightly more advanced than foundational level.

Previous quiz covered: [brief summary of what the baseline tested]
I've since studied: [areas you focused on]

New quiz requirements:
- Test deeper understanding and practical application
- Include more scenario-based questions that require connecting multiple concepts
- Require analysis and decision-making, not just recall
- 30 questions similar to actual exam format see the attached rubric
- Some questions should test edge cases or unusual situations

I want to see measurable improvement from my baseline test, but I also want to be challenged.

Example: {If you have previous years exams there is where you can use them}
```

Take the quiz and compare to your baseline. **This is the motivation boost that makes the whole process sustainable** seeing tangible improvement (from 60% to 85%, or from struggling to confidently explaining) makes studying enjoyable instead of a grind. The retrieval struggle is where learning happens, and seeing the results makes you want to keep going.

---

## Phase 1: Understanding - Teaching It (The Ultimate Test)

**Goal**: Solidify understanding by explaining the concept to someone else.

This is my favorite technique and one of the most effective ways to cement knowledge. Find someone who knows little about the topic and explain it in easily understood terms. Encourage them to stop you whenever they're confused, ask "why" and "how" questions, request more detail, and point out contradictions. This combines active recall, deep comprehension, and immediate feedback that exposes gaps in your knowledge. If you can't explain it simply, you don't understand it well enough yet.

**Alternative if no person is available**: Use AI as a student. Here's a prompt:

```
Act as an intelligent but non-technical person I'm teaching [topic] to. You're curious and want to understand, but you have no background in said topic.

Your role:
- Ask clarifying questions whenever something isn't clear
- Point out when my explanation seems contradictory or incomplete
- Request concrete examples when concepts are too abstract
- Show genuine curiosity about the topic
- Don't let me use jargon without defining it in plain language
- If I say something that doesn't make sense, tell me

I'm going to explain [topic] to you. Interrupt me frequently with questions. Challenge me when things aren't clear.
```

![image](/pictures/curiosity_crisis/student_prompt.png)

This is a text-based exchange to demonstrate the idea but **Speak out loud**, use voice input if your AI tool supports it. Speaking activates different parts of your brain than reading or writing, engaging more neural pathways and strengthening memory formation. If AI isn't pushing back or asking hard questions, the prompt needs work.

---

## The Micro-Cycle: Rinse and Repeat

This is what my learning cycle looks like, this cycle can take hours or days depending on complexity.

```
    ╔════════════════════════════════════════╗
    ║    1. IDENTIFY WEAK AREA (BROAD)       ║  ← Wide scope
    ║       Mind map whole topic             ║
    ╚════════════════════════════════════════╝
                    |
                    v
         ┌─────────────────────────┐
         │  2. BASELINE QUIZ       │  ← Narrowing focus
         │     Test specific area  │
         └─────────────────────────┘
                    |
                    v
            ┌───────────────┐
            │ 3. AUDIO +    │  ← Getting specific
            │    FLASHCARDS │
            └───────────────┘
                    |
                    v
              ┌─────────┐
              │ 4. DEEP │  ← Super specific
              │    DIVE │     
              └─────────┘
                    |
                    v
              ┌─────────┐
              │ 5. BREAK│  ← Maintain focus
              └─────────┘
                    |
                    v
            ┌───────────────┐
            │ 6. ADVANCED   │  ← Test specifics
            │    QUIZ       │
            └───────────────┘
                    |
                    v
         ┌─────────────────────────┐
         │  7. TEACH CONCEPT       │  ← Broaden back out
         │     Explain connections │
         └─────────────────────────┘
                    |
                    v
    ╔════════════════════════════════════════╗
    ║    8. IDENTIFY REMAINING GAPS          ║  ← Back to wide view
    ║       What's still unclear?            ║
    ╚════════════════════════════════════════╝
                    |
                    +---> REPEAT (zoom back in on gaps)
```

The key is variety. Don't re-read the same material five times or just highlight and review. Mix up your techniques and keep your brain guessing. Constantly switching between Understanding → Remembering → Focusing works far better than slamming your head against a wall with the same ineffective study method.

---

## Final Thoughts: Curiosity Amplified, Not Replaced

**Make it your own**: This workflow is a starting point. Experiment with different AI tools, learning modalities, quiz styles, break strategies, and teaching approaches. Track what works and notice patterns—when do you retain information best? What techniques feel effective versus just time-consuming?

**The bigger picture**: AI doesn't replace curiosity, understanding, or the work of learning, but when used intentionally with evidence-based techniques, it amplifies your ability to practise those things effectively. The "crisis" isn't AI making us stupider. It's passive consumption culture conditioning us to avoid the struggle of learning, algorithms optimising for engagement instead of curiosity, and the convenience of getting answers without understanding the questions.

**The choice**: Are you going to make AI your crutch or amplifier? If you copy-paste answers without understanding, avoid the struggle, appear knowledgeable while remaining ignorant, AI is your **Crutch**. But if you instead practise curiosity, use evidence-based learning techniques, embrace the struggle of active recall, strengthen curiosity by exploring deeper questions, it will **Amplify** your ability to rapidly learn new topics and you'll find yourself learning things you could never have imagined. Same tool, completely different outcomes.

---

Try this workflow with your next learning challenge. Adapt it, break it, make it your own, and figure out what works and what doesn't. We're all figuring this out together. The goal isn't to become dependent on AI but to use it as a tool to strengthen the curiosity muscle that makes learning possible in the first place.

Stay curious, keep learning, question everything!


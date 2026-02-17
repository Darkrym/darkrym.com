---
author:
  name: Darkrym
date: 2026-01-22
linktitle: Curiosity_Crisis_Part1
type:
  - post
  - posts
title: "Learning in the AI Era - Part 1: The Curiosity Crisis"
weight: 10
series:
  - guide
  - learning
  - ai
  - deep_dive
---

## Quick Caveat - A Note on AI Ethics and Safety

> This post is not about the ethics of AI development or deployment. I'm discussing AI as a learning tool, not endorsing the AI industry uncritically.

> I'm a strong proponent of AI safety and responsible development. The changes at OpenAI, specifically the shifting priorities around safety research, led me to cancel my ChatGPT subscription mid last year and switch to Claude. As Anthropic's approach to AI safety research is better than most in a desperately under-resourced field. But AI exists, it's not going away. We need to figure out how to use it responsibly while simultaneously pushing for proper safety measures, regulatory frameworks, and ethical development practices. This series focuses on the first part; responsible use as a learning tool.

> If you want to do deeper reading on AI safety and why this matters, I highly recommend: [If Anyone Builds It, Everyone Dies](https://ifanyonebuildsit.com/resources)

## Introduction

> "Always curious, constantly learning."

That's been my mantra for years now, it's how I try to live my life. Lately, I've been hearing a lot of concern that AI is making people stupider. That we're losing our ability to think, to learn, to truly understand things because we just ask ChatGPT or Claude for the answer. But I love AI, I utilise it every day to feed my curiosity and understand more about this world.

But I get it. I really do. On the surface, it looks bad. People copy-pasting AI responses without understanding them. Students submitting AI-generated essays. Developers shipping code they can't explain.

But here's the thing: I don't think AI is making us stupider. I think our collective curiosity has been atrophying for a while now, and AI just makes that decline more visible. The problem isn't the tool, it's how we've been conditioned to use tools passively instead of actively.

In this three-part series, I want to challenge the narrative that AI is dumbing us down. Part 1 (this post) explores what curiosity actually is and why it matters. Part 2 will introduce evidence-based learning frameworks. Part 3 will get practical with concrete workflows for using AI as a learning amplifier rather than a crutch.

---

## The Historical Echo: We've Been Here Before

The concern that new technology will make us stupider isn't new. It's ancient. Literally. In Plato's *Phaedrus*, Socrates expresses concern about the invention of writing. Yes, writing. The thing you're using right now to read this post. Here's what worried him:

From [Socrates: Writing vs. Memory](https://blogs.ubc.ca/etec540sept13/2013/09/29/socrates-writing-vs-memory/):

**Socrates' core concerns:**

1. **Memory deterioration**: Writing would "create forgetfulness in the learners' souls" because people would rely on external texts instead of internalising knowledge.

2. **Intellectual decline**: People would become "hearers of many things" but remain "learners of nothing" appearing knowledgeable while actually understanding little.

3. **Mental laziness**: People would depend on the written word instead of exercising their cognitive abilities, weakening intellectual development. 

Does this sound familiar? The printing press faced the same criticism. The calculator. Google. And now AI.

Replace "Written Words" with "AI" and you have the exact same argument being made today. Word for word. The concern that we'll appear or at least feel knowledgeable while trully understanding nothing. That we'll externalise memory instead of developing internal understanding. That we'll become mentally lazy.

Right now I want you to use all your lived experience with these past technologies to try to predict how AI will affect us in the long term.

So what happened with writing? Socrates was right - we did externalise memory. I don't have every malware sample, initial access vector, forms of persistence or IOC memorised. I don't keep thousands of CVE details in my head. I look things up, I utilise other people's knowledge to negate the need for me to memorise *everything*, and this makes me far more capable at my job, because I don't have to reinvent the wheel on every new piece of malware or threat actor I come across, I can rely on the wealth of knowledge already out there in the community. 

In the dialogue, Theuth argued that letters/written word would make people wiser and improve their memories, as well being a remedy for both forgetfulness and ignorance.

Which is exactly what has happened, we are wiser, we have better access to information than ever before. It made us capable of handling far more complex problems than any group of people could have possibly achieved in a pre-literate society. As we can build on hundreds of years of writing allowing us to free up our cognitive resources to think about higher-level problems instead of just memorising and processing those things in our direct sphere of influence.

So was Socrates fundamentally wrong? I don't think so. We've also seen his concerns play out, I think most people would agree that there has been a deterioration of our direct memory capacity. Instead of memorising information itself, we memorise where to find it.

Furthermore, Socrates worried about cognitive processing. That people would become "hearers of many things" but "learners of nothing." That passive reading of text would replace active dialogue and debate. To me this means people taking things at face value rather than critically engaging with ideas through discussion. And we've seen this too in the modern day with the rise and pervasiveness of misinformation. People consuming content without critically evaluating it, sharing headlines without reading articles, accepting claims without internal debate, spreading lies designed to harm people.

So how can both Theuth and Socrates be right? How can writing have made us both wiser and less capable at the same time?

This is where curiosity comes in; I believe curiosity is the difference between someone who uses these tools to become truly remarkable, contributing beyond themselves, advancing society, progressing the human race. Whilst a lack of curiosity leads to someone who is at best a spectator, but at worst a detractor from society, constantly repeating lies and misinformation without any idea they're being manipulated into harming others.

Every time we invent a new tool that externalises some cognitive function, we worry it'll make us dumb. But time after time we find, if we utilise it right, it just shifts what we use our brains for, allowing us to focus on something more important. The key here is that we need to utilise our curiosity to find that next important thing.

---

Thought Experiment: Could You Do Your Job Without Even Having Read Some Form of Written Knowledge?

I've worked with too many analysts over the years who have refused to utilise AI. Their reasons? Some variation of the age-old arguments raised by Socrates, that it will make us lazy, that we won't truly understand things, that we'll become dependent. Others echo more recent arguments from the age of automation, concerns that this technology will take people's jobs, make certain skills obsolete, or fundamentally change the profession in ways we can't control.

These arguments have been repeated over and over again whenever there's a new technology that scares people. But here's a thought experiment I pose to those analysts:

Let's make this concrete. Imagine you're a SOC analyst or threat hunter. Now imagine you lose access to:

- All threat intelligence blogs (Krebs on Security, The DFIR Report, etc.)
- IOC databases and threat feeds
- MITRE ATT&CK framework
- Vendor security advisories
- Detection engineering documentation
- Stack Overflow and technical forums
- Every cybersecurity book you've ever read

Could you still do your job?

Be honest. Could you investigate an incident without cross-referencing known TTPs? Could you write detections without looking up query syntax? Could you analyze malware without referencing unpacking techniques you learned from blog posts?

I couldn't. Not effectively.

The thing which makes us human is we always augmented our cognition with external tools. The difference isn't whether we utilise tools, it's whether we utilise them as crutches or as amplifiers.

- When you look up a MITRE technique, do you just copy the detection and move on? Or do you read the description, understand why it works, think about how an attacker might modify their approach, and adapt the detection to your environment?
- When you read a malware analysis blog post, do you just copy/paste the IOCs? Or do you follow the analyst's reasoning, understand how they arrived at each conclusion, and think about how you'd approach similar samples?

The difference is curiosity, writing didn't make us dumb. It made us capable of greater complexity, but only if we stay curious about what we're reading.

---

## The Real Culprit

So if AI isn't the problem, what is?

I believe it's the broader culture of convenience and passive consumption. We've been trained by algorithms that feed us exactly what will keep us engaged, which turns out to be fear, outrage, controversy, and dopamine hits. Not curiosity.

The trap isn't that AI gives us answers. It's that we've stopped asking good questions. We've stopped following up, stopped striving for deep understanding and AI makes this trap even easier to fall into. We no longer research deeply. We no longer spend hours comparing options against each other, weighing trade-offs, understanding nuances. We're so overwhelmed by amount of information available and so accustomed to convenience that we just take the first answer we see. We no longer look under the bonnet to understand how things actually work. 

When you ask an AI "How do I detect Kerberoasting?" and copy-paste the detection rule without understanding how Kerberoasting works, why the detection looks for those specific events, or what false positives you might encounter. That's not an AI problem, that's a curiosity problem.

The same person who was too lazy to read the full report or clarify their understanding of a piece of malware or cyberattack, is the same person today just copy/pasting from AI. It's just the tool changed, and made it easier for the rest of us to fall into this trap.

---

## Curiosity is a Muscle

I recently watched a video by Hank Green that perfectly articulated something I've been feeling but couldn't quite put into words. He talks about curiosity not as an innate trait you either have or don't, but as a muscle that gets stronger the more you utilise it.

Watch the full video here: [I Wasn't Always Like This!! - Hank Green](https://www.youtube.com/watch?v=Hh-Ah2hdC1g)

If you didn't watch the video, here are some key points to know before diving into the rest of this blog.

> "Curiosity makes everything feel more alive. It makes uncertainty less scary. It makes other people more interesting. It makes myself more interesting... **It also makes problems less scary because I can feel all of the other problems we have solved.**"

> "At its core, science is just trying to ask questions in ways that get good answers. And that creates this iterative dialogue between us and ourselves and everything else."

> "Curiosity is a muscle. And I have been incentivized to really exercise that muscle. And now my curiosity has been to the gym consistently for years. And he's like intimidatingly big."

This isn't just about science, it's about how we approach the universe itself. Curiosity is asking questions in ways that get good answers.

I think he puts it perfectly with the title `I Wasn't Always Like This!!`. This is a cognitive function you have to practise, actively training your curiosity through years of striving to understand how things work, and it fundamentally changes how your brain works. Every tiny oddity becomes something worth investigating. Every question leads to three more questions.

This matters in cybersecurity more than most other fields. Threat hunting isn't just about knowing what to look for, it's about being curious enough to notice what doesn't belong. When you see a PowerShell execution at 3 AM, do you mark it as suspicious and move on, or do you get curious? What was it trying to do? Why that time? What happened on the endpoint to lead to this?

The best analysts I know are insatiably curious. They don't just run down detections, they wonder why things work the way they do. They pull threads. They ask "but why?" until they understand the full picture.

---

## Where From Here?

Curiosity being a muscle means if you've let it atrophy, you can rebuild it. It just takes practise.

Start to question everything. Everything I see or experience, I want to have *some* understanding of why things are the way they are. Why did they design that particular thing in that way? What changed, and what reason did it have for being changed? Just enough curiosity to look at everything one level deeper. Over time, every system or idea you spend time to understand makes it easier to understand the next, soon enough you'll be amazed at the general understanding you develop about everything in the world around you!

I can tell you exactly how every system and piece of machinery on a warship works, every sewage plant, water desalination system, gas turbine, missile guidance system and diesel engine, even though my job had nothing to do with any of those. Because over the time I spent on that ship, any time I saw something new, I would seek out answers until I was satisfied with my understanding of it. That wasn't innate, it is the practised curiosity I have approached my life with. 

The key is the follow-up question. When anyone/anything gives you an answer, be an annoying 5 year-old and ask why. Ask what would happen if you changed one variable. Ask what this connects to. Ask what you're missing.

Coming full circle, treat AI like Hank Green treats the universe: as something to have a conversation with, not just extract answers from.

---

## Final Thoughts

Curiosity isn't dead, it's just been resting. And AI, used intentionally, might be exactly what we need to develop the next generation of curious world-changers.

But curiosity requires active cultivation. It's not something you have or don't have, it's something you practise or neglect.

Tools like writing, books, google, and AI are value-neutral. They amplify whatever approach you bring to them. If you approach them passively, they'll make you passive. If you approach them actively and with curiosity, they'll make you more capable of things you never knew possible.

This is where it gets exciting. What if instead of using AI to avoid learning, we used it for what it is `a tool` and utilise it to learn more effectively? That's what Parts 2 and 3 of this series are about. 

In [Part 2](/posts/2026/02/learning-in-the-ai-era-part-2-the-learning-cycle/), we'll explore evidence-based learning frameworks and how AI can fit into them. We'll look at the learning cycle and why understanding it matters before you start using AI as a study tool.

Stay curious folks, and I'll leave you with this thought:
> The question isn't whether AI will make us stupider or smarter. The question is: What are you going to do with it?

---

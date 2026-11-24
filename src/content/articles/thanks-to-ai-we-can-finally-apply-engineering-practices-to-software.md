---
title: "Thanks to AI, we can finally apply engineering practices to software"
description: "Software has always called itself engineering, but most of its big decisions were guesses, because testing an idea meant building it. AI makes experiments cheap. The engineering loop, step by step, and what each step looks like in software now."
date: "2026-11-13"
lang: "en"
cover: "../../assets/articles/engineering-practices-for-software.webp"
tags: ["ai","software-engineering","engineering","experiments"]
original:
  site: "the Coyotiv blog"
  url: "https://coyotiv.com/blog/thanks-to-ai-we-can-finally-apply-engineering-practices-to-software/"
---

When a civil engineer designs a bridge, nobody asks for their gut feeling about the steel. They know the loads, the span, the budget and the building code. They calculate, test a model, and compare the result with what they predicted. When the numbers disagree with the design, the design changes.

Software has called itself engineering for more than fifty years. In practice, most of our big decisions looked nothing like that. We picked a database because the lead had used it before. We chose between a monolith and microservices in a meeting. We debated a framework for a month, built with one, and lived with the result for five years. Nobody tested the alternative, because testing it meant building it.

That was a rational choice. A serious experiment in software used to cost a team several weeks. Building the same feature on two architectures to see which one holds up doubled the cost of the feature. So we argued instead. The person with the most experience, or the most confidence, won, and we called the outcome a decision.

AI coding agents change that cost. A competent engineer with a good agent can build a working version of an idea in an afternoon. Most people describe this as a productivity gain, the same software built faster. I think the bigger change is that software teams can finally afford to work the way other engineers do. They can state what they expect, test it, measure it and let the result decide.

We already wrote about one side effect of cheap building: [the demo is cheap now](https://coyotiv.com/blog/the-demo-is-cheap-now-how-to-choose-a-software-team-in-the-age-of-ai/), and harder to judge. This post is about the other side. If building is cheap, what should a team do with it?

## The engineering loop

Every engineering discipline works through some version of the same loop:

1.  Constraints, or what is fixed.
2.  Analysis of the problem and the system as they really are.
3.  A solution path, and a hypothesis about what it will do.
4.  An experiment, the cheapest thing that tests the hypothesis.
5.  Measurement against numbers you agreed on before you looked.
6.  Interpretation of the results, and what you do next.

Software teams mostly did steps 1 and 2 informally and skipped step 3. They merged step 4 into “build the real thing”, and did steps 5 and 6 after launch, if at all. Here is what each step looks like when experiments are cheap.

## 1. Constraints: write down what cannot move

Start by listing what is fixed. The budget and the deadline. The hardware the software must run on. The regulations it must follow. The existing system it has to live next to, and the team that will maintain it after launch.

This is the cheapest step, and the one teams skip most often. A constraint nobody wrote down shows up later as a surprise. The data must stay in Europe. The client’s IT department allows no new cloud vendor. The only person who understands the billing system leaves in March.

AI helps here mostly by reading. An agent can go through an existing codebase and list every external service it calls, every environment variable it reads and every database table it writes to. It can read a 200-page tender or a regulation and pull out the requirements that apply to you. A person still has to decide which items are real constraints and which are only preferences. But the list now takes an hour instead of a week, so there is no reason to start without one.

Hardware is the clearest case. When we built the [Gea Stack](https://geastack.com), the targets included game consoles, phones and embedded devices, where we did not want to ship a JavaScript virtual machine at all. Most of the design follows from that one line. Gea’s compiler turns TypeScript into C++ ahead of time, and the C++ compiles to native code for each target. [Skytail](https://skytail.coyotiv.com/), a Three.js game we built on it, runs natively on Xbox Series X, macOS and mobile devices from the same code.

## 2. Analysis: understand the system before you choose

Analysis means learning how the problem and the current system behave before you pick a solution. In software, assumption usually replaced this step, because reading a large codebase or tracing a production problem took days.

Agents read fast. You can ask one to trace a request through every service it touches, find every place a value gets written, or group six months of error logs by cause. You still have to check what it tells you, because an agent can be confidently wrong about code it has only half read. Checking a claim is still much faster than producing it from nothing.

Good analysis often removes the need for a project. In a two-month review of [an education company’s AI product](https://coyotiv.com/work/edtech-ai-transformation/), we found that a problem that looked like a data architecture question was a loading bug. Fixing the bug saved the team a much larger project. In the same review, we traced weak mock exams to how the agents searched for source material. The search sometimes returned material that sounded similar but didn’t fit the course.

## 3. Choose a path and state a hypothesis

Once you know the constraints and the system, pick an approach and write down what you expect it to do. A hypothesis has three parts: the change, the result you expect, and why you expect it.

“We’ll move search to a vector database” is a plan. “Moving search to a vector database will raise the share of relevant results in the top five from 60% to 80%, because most failed searches today use synonyms the keyword index misses” is a hypothesis. The second sentence can turn out to be wrong, and that is what makes it useful.

Software teams rarely wrote hypotheses, because there was rarely a way to test one before committing to it. If you are going to build the thing anyway, a written prediction only creates a record of being wrong. Cheap experiments change that. When you can test a prediction this week, it is worth stating precisely.

The reason matters as much as the prediction. If the result comes back as expected, but for a different reason than the one you gave, you learned less than you think.

## 4. Experiment: build the cheapest thing that answers the question

This is the step AI changes most.

An experiment is the smallest piece of work that tests the hypothesis. It is not the product. It can skip the login screen, the error handling and the deployment pipeline, as long as it answers the question.

Before coding agents, the smallest useful experiment in software was still large. Testing whether an event-driven design would handle your peak load meant building a good part of the system twice. So teams built one version, and the other one lived on in meetings, often for weeks.

Now you can try three architectures in a day instead of debating one for a month. Give an agent the same specification three times. Ask for a single service with a relational database, the same service with a queue in front of the slow work, and a version split into two services. Run the same load test against all three. By evening you have numbers instead of opinions. Each version is throwaway code. You throw the code away and keep the measurements.

The same goes for smaller questions, like two libraries for the same job, two data models for the same feature or two prompts for the same agent. Where a team used to pick one and hope, it can now build both and compare.

When we published our BRAID research, I said that cheaper reasoning lets you “run 30 different solution paths for the price of one.” The same holds for engineering in general. When an attempt costs less, you can make more of them, and each one tells you something.

One warning. Cheap experiments tempt teams to skip steps 1 to 3 and generate variants until one looks good. That is random search. Without a hypothesis, a variant that works tells you nothing about why it worked, or whether it will keep working.

## 5. Measurement: decide what counts before you look

Decide what you will measure, and what result counts as success, before you run the experiment. Write it down. If you choose the metric after you see the results, you will choose the one that makes your favorite option look good. Everyone does.

Software has had metrics for years, like latency, error rates and conversion. What teams often lacked was a metric tied to the hypothesis and agreed on in advance. AI work makes the gap obvious, because a model’s output is text, and text is hard to score.

The answer is a fixed test set. Write down the 20 or 50 cases that matter, with what a good answer looks like for each. Run every prompt change and every model change against the same set, and compare. We wrote about this in [Nobody needs a prompt management tool until the second incident](https://coyotiv.com/blog/nobody-needs-a-prompt-management-tool-until-the-second-incident/). A text file of twenty cases already counts as an evaluation set. [Raison](https://raison.ist), our prompt management platform, works the same way. Teams compare evaluations of prompt versions, then release or roll back a change without an application deployment.

With a fixed test set, a model change becomes a measurement. A new model comes out. You run your 50 cases on it, compare quality and cost with the model you use today, and have the answer by lunch. Without the test set, the same change is a matter of taste.

Sometimes the right metric does not exist yet. In [BRAID](https://arxiv.org/abs/2512.15959), the paper I wrote with Dr. Eyüp Çınar at OpenServ Labs, accuracy alone was misleading, because a large model can buy accuracy by spending more tokens. So we defined Performance per Dollar, the reasoning performance you get for each dollar spent. By that measure, small models running a structured reasoning plan reached 30 to 74 times the performance per dollar of a GPT-5-class baseline in several benchmark scenarios.

The metric does not have to be technical. A management coaching company asked us to look at its Slack assistant, because [people were not returning to it](https://coyotiv.com/work/ai-coaching-companion/). So the measures we chose were about participation. Did people respond? Which kinds of interaction got a response? How often did the assistant have to remind them? In the education review, we recommended that the product team first define what a good exam is, together with educators. Until that definition exists, no test of an exam generator can pass or fail.

## 6. Interpretation: read the results honestly, then go around again

The last step is deciding what the numbers mean. You keep the approach, drop it, or change the hypothesis and run again.

Two things go wrong here. The first is reading what you hoped for. If variant B beats variant A on a test set of 12 cases, the difference may be noise. If B wins on cases you wrote while building B, it may only have learned your cases. The second is ignoring how the result came about. A benchmark the model saw during training measures memory, not reasoning.

In BRAID we guarded against both. We used recent benchmarks with a low risk of data leakage, and masked the numbers in the problems so the models could not take shortcuts to the answer. Those checks cost time. They are also the reason the result means something.

A dropped approach still counts as a result. If the queue-based architecture did not improve peak load, you now know where the bottleneck is not, and the next hypothesis gets narrower. That is how the loop is supposed to work. It is also why we [named the company after a coyote](https://coyotiv.com/blog/the-case-for-wile-e-coyote-engineer-how-a-cartoon-character-shaped-the-way-we-build/) who treats every exploded rocket as information about rockets.

Then go back to step 1. Each round leaves fewer unknowns. Sometimes a constraint turns out to be negotiable. Sometimes the analysis was wrong. Write down what you learned. The next person who suggests the same idea should get the answer and the numbers, not someone’s memory of a meeting.

## What AI does not make cheaper

Cheap experiments do not make judgment cheap. An agent will build the three architectures. It will not tell you that the third one is the only one your team can maintain, or that the constraint you forgot is the one that matters. People who understand the system still have to choose the hypothesis, choose the metric and read the result honestly.

AI also makes it cheap to produce work that looks like an experiment and isn’t one. A dashboard full of numbers nobody defined in advance is one example. Ten variants with no question behind them is another. The more output a team can produce, the more it needs the loop.

## The alternative is no longer too expensive to test

For most of its history, software was the engineering field where you could not afford to test the alternative. We built the one design we had argued for, and found out years later whether it was right.

That has changed. A team that writes down its constraints, studies the system, states a hypothesis, runs cheap experiments, measures what it agreed to measure and reads the results honestly will make better decisions than a team that argues well. The loop used to cost too much for most decisions. Now one round can take an afternoon.

This is how we work at Coyotiv, on [our own products](https://coyotiv.com/products/) and with [clients](https://coyotiv.com/services/). If your team has been debating a decision for a month, build the options and measure them.

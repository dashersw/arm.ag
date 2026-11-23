---
title: "When a Cache Learned to Speak Mongoose"
description: "We are building a new SaaS, and I needed a queryable in-memory cache for a client library that would run on thousands of servers. It had to be lightweight, dependency-free, and…"
date: "2025-10-24"
lang: "en"
cover: "../../assets/x/G4CpLfEXkAECxM2.jpg"
tags: ["javascript","databases","open-source"]
---

We are building a new SaaS, and I needed a **queryable in-memory cache** for a client library that would run on thousands of servers. It had to be lightweight, dependency-free, and instantly usable — no binaries, no deployments, no setup. Just import, query, and go.

The surprising part? **This didn’t exist.**

How do people even unit test apps that use MongoDB? The only real option, *mongodb-memory-server*, literally installs a copy of MongoDB. It’s great for tests — but completely impractical for a client library that will live in thousands of production deployments. I wanted something that felt like Mongoose but stayed fully in memory.

That constraint became [memgoose](https://github.com/dashersw/memgoose), **an *almost* drop-in replacement for Mongoose.**

## From constraint to creation

I didn’t initially set out to build a database — I just needed a smarter cache. But once the core worked, it kept growing. One feature led to another, until it became a fully functional, Mongoose-compatible in-memory database.

It has the same expressive models, schemas, hooks, and virtuals that make Mongoose intuitive — so if you’ve used it before, you’re already at home. The familiar API was never just a design choice; it’s what made the entire idea practical.

And yes — it was **entirely** vibe-coded.

## Real-world performance

Indexed equality lookups are **O(1)** via smart indexes. Aggregation pipelines also use indexes when possible (especially when pipelines start with `$match`), and compound/indexed predicates leverage precomputed maps where non‑indexed queries fall back to scans.

On 100,000 documents, queries return in **fractions of a millisecond**. Pipelines that begin with `$match` narrow the candidate set using available indexes while there’s no hidden runtime optimizer — performance comes from the indexes and set‑based execution.

This isn’t a toy. It’s a real database engine, born from constraint and curiosity.

## Storage for when you need it

Eventually, I added persistence — mostly because it was fun, but also because some people might actually need it. Now, memgoose can switch between multiple backends with the same API:

- *a custom* **file-backed storage** layer with write-ahead logging and compaction,
- **SQLite** for simplicity and durability,
- and even **WiredTiger**, MongoDB’s own engine, for maximum performance and resilience.

Same code, different storage — no refactoring needed.

## Why it matters

When you build with clear boundaries, creativity expands. You start with something small and end up somewhere unexpected. That’s the story of **memgoose** — a tool that shouldn’t have needed to exist, but somehow did.

If you’re curious:

```bash
npm install memgoose
```

👉 [github.com/dashersw/memgoose](http://github.com/dashersw/memgoose)

What started as a simple need became a tool I wish existed years ago. Have you ever built something just because it *should* exist?

*First published [on X](https://x.com/dashersw/status/1981770147905122413).*

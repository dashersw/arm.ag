---
title: "memgoose"
tagline: "An in-memory database with a Mongoose-compatible API and pluggable persistence."
repo: "dashersw/memgoose"
stars: "57"
year: 2025
order: 45
---

memgoose is a lightweight, type-safe, in-memory database that speaks Mongoose: the same models, schemas, hooks and virtuals, with nothing to install or deploy. It began as a queryable cache for a client library that had to run on thousands of servers, and grew into an almost drop-in replacement for Mongoose.

Indexed equality lookups are O(1), aggregation pipelines use indexes where they can, and queries over 100,000 documents return in fractions of a millisecond. When you need persistence, the same API runs on a file-backed store with write-ahead logging, on SQLite, or on WiredTiger, MongoDB's own engine.

I wrote about how it came to be in [When a Cache Learned to Speak Mongoose](/articles/when-a-cache-learned-to-speak-mongoose/).

```bash
npm install memgoose
```

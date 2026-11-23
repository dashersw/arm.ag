---
title: "Gea Stack"
tagline: "One TypeScript codebase, compiled ahead of time to native binaries, from microcontrollers to consoles."
repo: "geastack/compiler"
stars: "59"
url: "https://geastack.com"
year: 2026
order: 10
---

Gea Stack is what I spend most of my time on now. It is a native UI stack: you write a product interface in TypeScript, JSX and real CSS, and a compiler turns it into a native binary for the device. The device runs no browser and no JavaScript VM. The compiled binary is the app.

It grew out of [Gea](/projects/gea/), the web framework. Once the framework was compiler-first, the obvious next question was whether the same source could target something other than the DOM. It can.

## What it compiles to

- **Microcontrollers:** ESP32, ESP32-S3, ESP32-P4 and RP2350 boards
- **GeaOS:** Linux-backed devices such as phones and watches
- **Desktop:** macOS (AppKit), Windows (Win32) and Linux, including Raspberry Pi OS
- **Mobile:** iOS (UIKit) and Android (real Android views, no WebView)
- **Wearables:** Pebble Time 2
- **Consoles:** Xbox Series X/S
- **Servers:** `node:http` applications compiled to native binaries
- **Web:** a browser simulator for development, with an optional WebAssembly device renderer

## geatsc

The centre of the stack is `geatsc`, a compiler from TypeScript to C++. The output contains no JavaScript engine or interpreter; a regular C++ toolchain builds it into firmware, an app or a server executable. It uses the TypeScript types to pick native representations: classes become structs, numbers become native numeric types, and typed arrays, maps and records become typed containers.

```bash
npx @geastack/create-geastack my-app
npx gea setup
npx gea dev
npx gea flash --board <alias> --monitor
```

## See it running

Real CSS transforms, perspective and keyframes on an ESP32-S3 AMOLED board:

<div class="embed video"><iframe src="https://www.youtube-nocookie.com/embed/pC3kNSWaL18" title="CSS 3D cube running on ESP32 with GeaStack" loading="lazy" allowfullscreen></iframe></div>

The launch stream, where I walk through the whole stack on microcontrollers, Linux, iOS, Android, iPadOS and macOS:

<div class="embed video"><iframe src="https://www.youtube-nocookie.com/embed/Up7uX7bAp-4" title="Meet GEA, the One Stack to Bind Them All" loading="lazy" allowfullscreen></iframe></div>

## Where things live

The framework, compiler, CLI, simulator and the desktop, mobile and Node targets are Apache-2.0. Embedded board support is GPL-3.0. Examples, tutorials and agent skills are MIT. The Xbox target is available commercially. Gea Stack is developed at [Coyotiv](/coyotiv/).

<a class="linkcard" href="https://geastack.com/docs"><strong>Gea Stack documentation</strong><span>Getting started, targets, boards and the compiler.</span><em>geastack.com</em></a>

<a class="linkcard" href="https://github.com/geastack"><strong>geastack on GitHub</strong><span>Compiler, core, CLI, targets, examples, demos and tutorials.</span><em>github.com</em></a>

<a class="linkcard" href="https://github.com/dashersw/coyopedal"><strong>dashersw/coyopedal</strong><span>A complete product built on the stack: a neural amp modelling guitar pedal on an ESP32-S3.</span><em>github.com</em></a>

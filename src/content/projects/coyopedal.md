---
title: "coyopedal"
tagline: "A standalone guitar amp and effects pedal on an ESP32-S3, running neural amp models in real time."
repo: "dashersw/coyopedal"
url: "https://coyopedal.playtaurus.com"
stars: "304"
year: 2026
order: 50
---

coyopedal is a guitar pedal you can build from a touch-screen ESP32-S3 development board. It runs Neural Amp Modeler A2 captures in real time and loads them straight from an SD card.

It brings together three things I care about: guitar gear, electronics and compilers. The touchscreen interface is written in TSX and compiled to native C++ with [Gea Stack](/projects/geastack/), so there is no JavaScript engine on the device. The same interface also builds to WebAssembly, which is what runs in the browser demo.

It is a descendant of [pedalboard.js](/projects/pedalboard-js/), which did guitar effects in the browser in 2013. This time the browser is optional.

<a class="linkcard" href="https://coyopedal.playtaurus.com"><strong>Try the pedal in your browser</strong><span>The WebAssembly build of the same firmware UI.</span><em>coyopedal.playtaurus.com</em></a>

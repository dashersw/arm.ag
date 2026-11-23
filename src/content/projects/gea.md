---
title: "Gea"
tagline: "A compiler-first reactive JavaScript UI framework. No virtual DOM, compile-time JSX, proxy-based stores."
repo: "dashersw/gea"
url: "https://geajs.com"
stars: "1.2k"
year: 2026
order: 20
---

Gea is a UI framework for the web built on one opinion: JavaScript is enough for reactivity. You should not need signals, dependency arrays, compiler directives or framework-specific primitives to build a reactive interface.

```jsx
// counter-store.ts
import { Store } from '@geajs/core'

class CounterStore extends Store {
  count = 0
  increment() { this.count++ }
  decrement() { this.count-- }
}

export default new CounterStore()
```

```jsx
// app.tsx
import { Component } from '@geajs/core'
import counterStore from './counter-store'

export default class App extends Component {
  template() {
    return (
      <div>
        <h1>{counterStore.count}</h1>
        <button click={counterStore.increment}>+</button>
        <button click={counterStore.decrement}>-</button>
      </div>
    )
  }
}
```

You write `this.count++` and the DOM updates. You don't call a setter, you don't wrap values in a signal, and you don't declare dependencies.

## How it works

Gea compiles JSX into HTML string templates at build time, tracks state changes through deep proxies, and patches only the DOM nodes that depend on the changed data. There is no diffing and no reconciliation.

Stores are plain classes, computed values are getters, and objects passed as props are the parent's reactive proxy, so two-way data flow needs no ceremony. A router is built in and tree-shakable.

## Size and speed

Because the compiler does the work, very little ships to the browser. A hello-world production build is 121 bytes of brotli-compressed JavaScript; an equivalent interactive todo app is 4.9 kB. For comparison, the same hello-world is about 3.6 kB in Solid, 8.5 kB in Svelte, 20.7 kB in Vue and 50.8 kB in React.

In the js-framework-benchmark, Gea's weighted geometric mean is 1.02, where 1.00 is hand-written vanilla JavaScript. The [full benchmark report](https://geajs.com/benchmark-report.html) has the numbers and the method.

## Packages

- `@geajs/core`: the framework
- `@geajs/ui`: accessible components built on Zag.js state machines and Tailwind CSS
- `@geajs/mobile`: views, navigation, gestures, pull-to-refresh and infinite scroll for mobile web apps
- `@geajs/ssr`: streaming server-side rendering with hydration
- `@geajs/vite-plugin`: JSX transform, reactivity and HMR
- `create-gea`: `npm create gea@latest my-app`

## Where it comes from

Gea continues a line of work I started a decade ago: [erste](/projects/erste/) for views and [regie](/projects/regie/) for state, both built on the idea that a framework should stay out of the way of the language. Gea is that idea with a compiler behind it, and it became the foundation of [Gea Stack](/projects/geastack/), which compiles the same components to native binaries.

I built most of it live on stream. The launch stream is in Turkish:

<div class="embed video"><iframe src="https://www.youtube-nocookie.com/embed/ripShfX6jAA" title="Dünyanın En Hızlı JavaScript Framework'ünü Nasıl Geliştirdim?" loading="lazy" allowfullscreen></iframe></div>

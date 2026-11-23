---
title: "erste"
tagline: "erste.js is a zero-hype view library with an attitude. It’s built for achieving maximum performance on mobile devices."
repo: "dashersw/erste"
stars: "283"
year: 2017
order: 80
---

Find [erste on GitHub](https://github.com/dashersw/erste).

<a class="linkcard" href="https://github.com/dashersw/erste"><strong>dashersw/erste</strong><span>erste - Your first choice for hybrid mobile applications</span><em>github.com</em></a>

## Features

- Lightweight, 10kb minified & gzipped
- No dependencies
- No magic — as declarative as it should be and no more
- No pitfalls — use good old DOM APIs, HTML5 & CSS3 to build modern apps
- Clean, structured and approachable API

## Overview

```js
// 1. Import erste,
import {Component} from 'erste';
```

```js
// 2. Create your application,
class App extends Component {
    constructor() {
        super();
        this.counter = 0;
    }
```

```html
    // 3. Arrange your view,
    template() {
        return `
        <div>
            <h1>${this.counter}</h1>
            <button class="increment">Increment</button>
            <button class="decrement">Decrement</button>
        </div>
        `;
    }
    // 4. Create your methods,
    increment() { this.$('h1').innerText = ++this.counter; }
    decrement() { this.$('h1').innerText = --this.counter; }
```

```js
    // 5. Bind your events.
    get events() {
        return {
            'tap': {
                '.increment': this.increment,
                '.decrement': this.decrement
            }
        }
    }
}
```

```js
// 6. Make your application run.
new App().render(document.body);
```

erste.js has a lot more to offer in terms of application development. You can check out the various built-in components — such as the navigation bar, the tab bar and more — and learn how you can make use of the advanced features. Make sure to try the demo over at [erste.js-demo](https://github.com/dashersw/erste.js-demo) to see it all in action.

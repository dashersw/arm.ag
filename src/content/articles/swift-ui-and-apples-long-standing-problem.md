---
title: "Swift UI and Apple’s long-standing problem"
description: "It’s an exciting day as Apple announced their biggest take on application development yet."
date: "2019-06-03"
lang: "en"
tags: ["mobile-app-development","swift","apple","web-development"]
---

<figure>

![Photo by Daniel Korpai on Unsplash](../../assets/medium/1-Fd1ON5i6eRjQO7OgJobrWQ.png)

<figcaption>

Photo by [Daniel Korpai](https://unsplash.com/@danielkorpai?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

</figcaption>
</figure>

This is an article version of my long thread on Apple and Swift UI. You can see the original thread here:

<blockquote class="tweet"><p>Let me start a thread about Apple, and its relationship to the web. Apple has had a long time problem for their platforms, and that is the web. Initially, when iPhone came out in 2007, Steve Jobs was promoting an open web.</p><a href="https://twitter.com/dashersw/status/1135642781471432704">@dashersw on X</a></blockquote>

Apple has had a long time problem for their platforms, and that is the web. Initially, when iPhone came out in 2007, Steve Jobs was promoting an open web.

<blockquote class="pull">

Apple created hardware-accelerated CSS for building apps for the original iPhone

</blockquote>

There was no native App Store, because Apple believed the future would be in web apps installable on the home screen. In fact, right off the bat, Safari had support for installable web apps. Apple believed in this technology so much that they created special hardware-accelerated CSS declarations, for the first time, to enable 60fps animations on the web. Yes — the first ever iPhone with its limited capabilities was able to run 60fps web animations.

Apple was teaching the best practices of web performance throughout countless WWDC’s afterwards. But then, only after a year, a shift in strategy occurred: Apple decided to create a native App Store for native apps, mostly porting its frameworks for Mac. Apple realized that there was more money involved — this would become literally a trillion dollar industry. Everything clicked: an existing Mac developer base, ability to shape APIs according to hardware without waiting for other vendors, exclusivity, and more money.

Still, Apple couldn’t ignore the web. Monetization on the web occurred mostly through advertisements, and these were in HTML and CSS. Apple wanted to create an ad network for its app ecosystem and in order to enable advertisers, they once more turned to the web. They released iAd, which let you build ads that could be displayed on iOS apps. But this was only the beginning — you could even do little interactive apps with it that mimic the native iOS UI. This was actually ground-breaking, because in order to make the API accessible to everyone, Apple had created a replica of their UIKit framework in… wait for it… JavaScript! Back then, Apple was frantically hiring JavaScript architects with experience in framework development.

For years, Apple kept developing this further and further. With every release of XCode there came a little app called Dashcode. Dashcode was used to build Dashboard widgets (which used web technologies) and iAd applications. Almost every native UI element was rebuilt in HTML, JavaScript and CSS, and they were actually very performant to use. Every version of Dashcode had a newer version of this library. I still have a copy of this library around, which is a web replica of UIKit and more.

<blockquote class="pull">

Objective C wasn’t welcoming. It was an archaic way of building apps.

</blockquote>

But years passed. Apple slowly turned its back on the openness of the web, to a degree to cripple installing web pages to iOS home screens. They ditched iAd, they ditched Dashcode, and their web framework. There was a huge problem, though. Apple needed to scale to more developers for a healthier ecosystem, and onboarding new developers to Objective C was taking painstakingly long. It wasn’t welcoming, it wasn’t performant, and the tooling was also far behind its modern counterparts.

Apple wanted to serve a modern development experience, and Objective C just wasn’t cutting it. Meanwhile, the web hit back. Hybrid development environments that allowed web technologies to be used to develop mobile applications were everywhere. In order to cut down on development costs, popular apps like Facebook and LinkedIn had switched to HTML5 web applications bundled as native applications. In the hands of developers who didn’t heed Apple’s performance tips, hybrid apps turned into a UX and performance nightmare.

Still, there were orders of magnitude more web developers than Objective C developers, so the economics just didn’t cut it. A lot of individual developers and companies embraced hybrid technologies even though they knew they were inferior. Apple had to step up its game.

The year was 2013, and, I believe, Apple had to make a decision. In order to offer a modern development experience, they knew they had to do something. I was expecting Apple to announce native support for using JavaScript to build native iOS apps in WWDC 2013. They already had JavaScriptCore, and this iAd library that mimicked UIKit. They could make the leap to enable JavaScript as a first-class citizen to build native apps, and this would instantly open up the Apple ecosystem to millions of developers worldwide. That was why I was hopeful of an announcement for WWDC 2013… but it didn’t come. I was very surprised, because Apple was losing a lot of opportunities being stuck with an ancient language and development environment.

<blockquote class="pull">

Swift was a major turning point in the history of computing.

</blockquote>

Another year passed. For 2014, I was sure that Apple would come up with something… and they came up with Swift; a beautiful, modern, performant language that doesn’t have the complexity and the pitfalls of Objective C. This was a major turning point in the history of computing.

Apple had the chance to radically *own* software development, and they instead decided to stay within their walled garden. Still, Swift 1 was beautiful, fast, and although incomplete, one was able to create any sort of applications with it…

Since Swift applications were highly optimized, they were great for system applications and backend applications. So IBM, along with others, started experimenting with Swift on the backend, with astounding results. Swift actually works pretty well in Linux for any HTTP-based app.

But years passed, the language had a couple of overhauls and several major versions that added more and more to the language. Nowadays, I fear, in order to understand Swift and use it to its fullest capacity, you have to dig in as much as you had to for Objective C.

While Swift was getting more and more convoluted, the web community kept on growing. Hybrid mobile apps were great, but what if we could do hybrid desktop apps? That would be a brilliant cost optimization! First, there were efforts like node-webkit and MacGap. MacGap was especially awesome, because instead of a full WebKit engine, it was just using a WebView. That meant extremely small app sizes, and small resource utilization. The most hated app for resource consumption nowadays is Slack, and they were using MacGap back then!

MacGap was cool, but I never got why it didn’t pick up. Node-webkit turned into nwjs, and then Electron (formerly Atom core) came on the scene, and drew a lot of attention from web developers. Suddenly, Mac App Store saw a burst of web applications bundled as native apps. It’s this period when Apple withdrew more and more web-app installable features from iOS, and as a counter move, Google went deeper into making PWA apps a first-class citizen on Android. This shift is still happening, and we’ll see if Apple will adopt PWA apps on iOS.

<blockquote class="pull">

Apple is desperately trying to make it easier than ever for existing apps to be ported to other platforms.

</blockquote>

Apple is at odds right now. They desperately need more developers, and they introduced numerous technologies in the past to help existing developers expand their offerings to other Apple platforms, including among several others, auto-layout. Last year came Marzipan, which is now rebranded as Catalyst. Apple is desperately trying to make it easier than ever for existing apps to be ported to other platforms. And as a final entry in this whole run, today Apple announced Swift UI.

Swift UI is Apple’s latest attempt at modernizing cross-platform application development. Apple finally understood that keeping centralized business-logic and rewriting the UI for different platforms isn’t enough. Because UI is the most notorious part to get right.

So from what we see, they are tackling this problem with a refreshed look at UI development that is heavily inspired by many modern UI frameworks, including the web frameworks. This is exciting news, as Swift UI is capable of cross-platform output with a single API.

It’s also extremely exciting to see that they are incorporating cues from visual programming, which was mostly a dream until now. What would you expect, really — only Apple could make it into a reality, and I believe they learnt a lot from their playground, Swift Playgrounds.

Here’s the most important bit, though — if Apple wants to close the circle in on web developers, Swift UI has to compile to web.

Think about it. We are building web applications — full-fledged applications that run in browsers. For years. And we still couldn’t agree on a universal UI paradigm for these apps. Most of them just look like bloated web pages.

And just because we could (and we desperately needed), we brought this approach to the desktop to build cross-platform desktop apps that don’t feel at home anywhere. Technologies like React Native are trying to tackle this from every angle, but still there is no right way. And, again, we have to do this, because we can’t possibly write native apps for every platform. That just doesn’t scale. We want to write them though — it’s just not convenient enough. So we do the most practical thing and stick with JavaScript and CSS, the perfect combo.

<blockquote class="pull">

Apple could re-define application development if they work on cross-platform renderers for Swift UI.

</blockquote>

Yet, Apple, as ever, is now in a very unique position with Swift UI, which is a pleasant-to-use, modern-as-ever, app authoring environment for Apple ecosystem. If Apple wants to end this oncoming web presence, they now have a choice.

This is also extremely useful for Apple customers. Electron-based apps take 60% of my MacBook’s RAM, for pretty much no reason. If Apple could stop the hybrid app onslaught, it would be one of the biggest performance improvements of our decade.

Apple could re-define application development if they work on cross-platform renderers for Swift UI. Think that Swift can export apps to the web, Android, and Windows. And Linux. All natively. This is a cute story we heard before, but no one could do it properly until now.

I am now hopeful for Swift UI to wildly take off, and Apple to announce a web renderer for it specifically for mobile web applications, in, say, WWDC 2020.

I know this probably will never come true, but it would be a great opportunity for millions of developers to finally cast aside bulky, productivity-killer app development approaches that are over-shadowed by corporate presence, and corporate agendas. And, funnily enough, Apple has enough resources for this to happen — just get the old iAd library from the attic. It’s what Swift UI now compiles to on iOS anyway.

Apple has countless opportunities in this field. This should just be the beginning. I would be disappointed to see Swift UI only useful for porting iPad apps to the Mac. It has so much potential! Let’s see where Apple will take it in the coming years.

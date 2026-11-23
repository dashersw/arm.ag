---
title: "cote"
tagline: "A Node.js library for building zero-configuration microservices."
repo: "dashersw/cote"
stars: "2.4k"
year: 2013
order: 30
---

Find [cote on GitHub](https://github.com/dashersw/cote).

<a class="linkcard" href="https://github.com/dashersw/cote"><strong>dashersw/cote</strong><span>cote - A Node.js library for building zero-configuration microservices.</span><em>github.com</em></a>

cote lets you write zero-configuration microservices in Node.js without nginx, haproxy, redis, rabbitmq or *anything else*. It is batteries — and chargers! — included.

## Features

- Zero dependency: Microservices with only JavaScript and Node.js
- Zero-configuration: no IP addresses, no ports, no routing to configure
- Decentralized: No fixed parts, no “manager” nodes, no single point of failure
- Auto-discovery: Services discover each other without a central bookkeeper
- Fault-tolerant: Don’t lose any requests when a service is down
- Scalable: Horizontally scale to any number of machines
- Performant: Process thousands of messages per second
- Humanized API: Extremely simple to get started with a reasonable API!

## Develop your first microservices in under two minutes:

in `time-service.js`...

```js
const cote = require('cote');
const timeService = new cote.Responder({name: 'Time Service'});
```

```js
timeService.on('time', (req, cb) => {
    cb(new Date());
});
```

in `client.js`...

```js
const cote = require('cote');
const client = new cote.Requester({name: 'Client'});
```

```js
client.send({type: 'time'}, (time) => {
    console.log(time);
});
```

You can run these files anyway you like — on a single machine or scaled out to hundreds of machines in different datacenters — and they will *just work*. No configuration, no third party components, no nginx, no kafka, no consul and onlyNode.js. cote is batteries — and chargers — included!

## Microservices case study

Make sure to check out [the e-commerce case study](https://github.com/dashersw/cote-workshop) that implements a complete e-commerce application with microservices using [cote](https://github.com/dashersw/cote). It features;

- a back-office with real-time updates for managing the catalogue of products and displaying sales with a RESTful API (express.js)
- a storefront for end-users with real-time updates to products where they can buy the products with WebSockets (socket.io)
- a user microservice for user CRUD
- a product microservice for product CRUD
- a purchase microservice that enables users to buy products
- a payment microservice that deals with money transactions that occur as a result of purchases
- Docker compose configuration for running the system locally
- Docker cloud configuration for running the system in Docker Cloud

cote plays very well with Docker, taking advantage of its network overlay features. The case study implements a scalable microservices application via Docker and can scale to multiple machines.

![](../../assets/medium/1-jz0ySCiW0Y-mY18S3gXvhw.png)

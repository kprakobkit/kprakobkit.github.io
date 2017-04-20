---
title: Write a README
date: "2017-04-03"
layout: post
path: "/write-a-readme/"
publish: true
---

Oftent times I would find myself rumaging through old side projects trying find this piece of code that I wrote a while back. Then I would try to run and build the project, only to realize there are no instructions on how to do so and wishing that I had spent the one minute to write a quick README.

To deal with this, I recently practiced writing a simple README for each of my side projects, mostly for my future self, that includes how to setup and run the project. This is very simple and I think every project should have one. It should include things like how to setup, run, test, and deploy. Just a simple command for each would do.

An alternative to having a README that I think also works is to have some sort of `go` script with commands like `go serve` to start the app. Since I've been playing around with Javascript alot recently, NPM scripts in `package.json` work really well too. If you standardize the scripts across your projects, i.e. `npm start`, `npm test`, `npm run watch:client`, `npm run watch:server`, etc., then you won't have to worry about how to specifically build each project.

So do your future self a favor and spend that one minute writing a README, or use scripts to make running and building your app as easy as possible.

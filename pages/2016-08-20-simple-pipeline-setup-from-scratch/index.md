---
title: Simple Pipeline Setup from Scrath
date: "2016-08-20"
layout: post
path: "/simple-pipeline-setup-from-scratch/"
publish: true
---

Tools like Heroku, Docker, or Vagrant do an excellent job of abstracting the tasks of setting up an environment for deployment that I never really understood what exactly is involved. Because I'm a big fan of redoing things from scratch for the purpose of learning how it works, I tried manually setting up an environment from scratch. My goal was to, in the end, have a CI environment. I was able to push my changes locally, have it trigger a build on [Snap CI](https://snap-ci.com/), and deploy that code onto the CI environment for my Clojure todo app. This was a daunting task for me at first because I had NO IDEA what I was doing, but at the end I found out that it actually wasn't that complicated. Overall, it was a great learning experience and I highly recommend doing the same to any beginners out there. In this blog post, I will be walking through the high-level steps and some learnings along the way.

## The Environment

First was deciding a hosting solution for the CI environment. I went with [DigitalOcean](https://www.digitalocean.com/) because someone had recommended it to me, and it was the simplest to setup. It even has a great [tutorial](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-clojure-web-application-on-ubuntu-14-04) for deploying Clojure apps, which I used.

Setting up on DigitalOcean was as simple as clicking a button (to create a droplet). Once that's done, I had to ssh into the machine and setup a non-root user because using a root user is a no no because you can really mess things up. Again DigitalOcean has a great [tutorial](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-clojure-web-application-on-ubuntu-14-04) on getting this setup. It essentially boils down to:

1. Add a user
2. Set this user up with root privileges - this allows the user to run commands with administrative privileges using `sudo`
3. Add a public key to the machine so you can easily ssh into the machine without having to use a password. To read up more on how this works, go [here](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server).
4. Disable remote ssh as root

I had to run a bunch of commands I had never seen before, but that's essentially what the commands are doing.

After setting up the user, now it's time to setup the environment. First I installed git, and cloned my Clojure todo app repository. Then I installed Java and Leiningen. Pretty straight forward, right?

Now comes the interesting part - setting up the app so that it can be accessed from the outside world. The highlevel architecture of this is an Nginx server running as a proxy server and Supervisor. This is by no means production ready, and is only one of MANY options available for setting up the environment. This setup was recommended by DigitalOcean so I just went it with because why not. Nginx is responsible for routing external traffic to the app - it's proxying requests to port 80 to whatever port our clojure app is listening to. For the todo app, it'ss 10555. Supervisor is used to run a combination of starting/stopping the server and writing to log files.

Lastly, I installed PostgreSQL, and again, thank you DigitialOcean for their wonder tutorials, I followed the steps [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04). I ran into a permissions issue on PostgreSQL and documented it [here](/postgresql-permissions/) a while back.

Now that we have the environment all setup, next is the pipeline.

## The Pipeline

I came up with a very simple pipeline using [snap-ci](https://snap-ci.com/) and what I thought made sense - I didn't follow any tutorials. This is the workflow:

1. Push to Github
 - Add webhook on github to trigger a build on Snap CI
2. Snap CI runs a build
3. Snap CI pushes to DigitalOcean instance when build is successful

I wrote a basic deploy script on the DigitalOCean instancethat Snap CI executes after a succssful build.

```bash
#!/bin/bash
set -e

cd ~/todo-clj

git pull --rebase

lein uberjar

sudo cp ~/todo-clj/target/todo-clj.jar /var/www/todo-clj/app/

sudo service supervisor restart

sleep 5s

sudo service nginx restart
```

That's it! At first I didn't really know what to expect when I started this, but in the end, it's not all that hard.

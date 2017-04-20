---
title: Basic Auth
date: "2017-04-04"
layout: post
path: "/basic-auth/"
publish: true
---

Whenever I start a side project that requires some sort of user registration/login process I always find myself googling for hours on how to implement user authentication. This leads me to waste many hours looking through frameworks, most of which are always too much for what I need. All I need is a simple process for creating users and allowing them to login, and the process itself isn't complicated. To save myself for re-googling user authentication, I've managed to boil down the steps and components here so my future self can come back and use this as a resource. My goal of this is to have a language agnositc process of the components for implementing a simple user authentication. Nothing fancy here.

Note that this method of authentication is called 'Session/Cookie-based Authentication', as opposed to 'Token-based Authentication'. More on this [here](https://security.stackexchange.com/questions/81756/session-authentication-vs-token-authentication) and [here](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/).

I'll start from what the user sees, then dive down to the routes and backend implementation to support this.

1. Registration - should be a registration form that submits a post request with the user information to some sort of `/users` route. This route takes the params and attempts to create a user.

2. Login - the login form should take in a user's credentials, usually their username and password, and submits a post request to some sort of `/login` route. The route should check if the user's credential is valid. If so, it should maintain that the user is logged in. There are multiple ways to do this, but the most straight forward one is to save a user object in the session (You can learn more about sessions [here](https://learn.co/lessons/sinatra-sessions)). Checking that there is a logged in user is just checking there the user in the session still exists.

3. Logout - the act of logging out is to just send a post request to a `/logout` that would clear the user in the session.

And that's it in terms of a high level overview.

One important note though is to never re-invent the wheel. Smart people have thought through this problem and you should rely on their expertise by utilizing existing frameworks and such when implementing this.

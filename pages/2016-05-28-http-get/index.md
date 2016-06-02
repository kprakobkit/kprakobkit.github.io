---
title: Http - GET
date: "2016-05-28"
path: "/http-get"
publish: false
---

Someone once told me that one of their best learning experience as a programmer was reading the [http spec](https://www.w3.org/Protocols/rfc2616/rfc2616.html)[]. It's pretty long so I figured the best to learn is to build a service that conforms to the spec. In this post, I'll attempt to summarize what I've learned about the GET method while building a [full-stack todo app](http://github.com/kprakobkit/todo-clj) web service.

The [GET](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3) method is for retrieving an entity identified by the request-uri. If you are familiar with RESTful API, GET requests are usually in the form of `http://api.food.com/burgers`.

---
title: Clojure Todo - 1 of 2
date: "2016-08-01"
layout: post
path: "/clojure-todo-1/"
publish: true
---

This is the first of a two part walktrhough of my Clojure Todo App.

Over the last few months I’ve been working on creating a full stack todo app using the Clojure stack - ClojureScript, Clojure, and Postgres. I also explored multiple options for hosting this app, which I will write about in a separate blog post. It’s been a great learning experiencing building and deploying the app from scratch. I’m documenting the experience here to solidify my learning, as well as pay it forward.

This blog post is divided into sections that correspond to each part of the stack (front-end, server, backend). Let’s first start at the meat of this, which is the server and the database, written in Clojure.

Note: The source code is available [here](https://github.com/kprakobkit/todo-clj).

## The Server

The server is responsible for handling incoming http requests and interacting with the database, through a model, which I’ll cover shortly. I’m using Ring and Compojure, which seems to be the standard for the Clojure stack. Ring is an abstraction over the HTTP server and is comparable to Ruby’s Rack. Compojure is the routing library for Ring.

The meat of the server is in the main function where we call the run-jetty function giving the http-handler.

```clojure
(defn -main [& [port]]
  (let [port (Integer. (or port (env :port) 10555))]
    (run-jetty http-handler {:port port :join? false})))
```

The http-handler is a composition of ‘middleware’ wrappers, ring or custom, and the routes. This is pretty cool. You can add additional ring middleware like wrap-with-logger or wrap-son-response, or custom wrappers like wrap-response-url-body. I like this style a lot because it makes it very explicit what middleware is being used to handle the request or response.

```clojure
(def http-handler
  (-> routes
      (wrap-defaults api-defaults)
      wrap-response-url-body
      wrap-json-response
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :put :post :delete :patch])
      (wrap-json-body {:keywords? true})
      wrap-with-logger
      wrap-gzip))
```

Now let’s take a look at the routes. Compojure’s defroutes function is responsible for creating all the route handlers and looks fairly straight forward. In this implementation, each route interacts with a different method on the model - create,all,find-by-id, delete-all, etc.

As a side note, I followed the [todo-backend spec](http://www.todobackend.com/) when I was creating this portion of the todo app. The site is awesome and even has a test suite that you can run against.

```clojure
(defroutes routes
  (GET "/" _
    {:status 200
     :headers {"Content-Type" "text/html; charset=utf-8"}
     :body (io/input-stream (io/resource "public/index.html"))})
  (resources "/")
  (GET "/todos" _
    (-> (todos/all)
        res-ok))
  (GET "/todos/:id" {{id :id} :params}
    (-> id
        todos/find-by-id
        res-ok))
  (POST "/todos" {body :body}
    (-> body
        todos/create
        res-created))
  (PATCH "/todos/:id" {{id :id :as params} :params body :body}
    (-> id
        (#(todos/update-todo % body))
        res-ok))
  (DELETE "/todos" _
    (todos/delete-all)
    (res-no-content))
  (DELETE "/todos/:id" {{id :id} :params}
    (todos/delete id)
    (res-no-content)))
```

That concludes the server, let’s now look at the model.

## The Model

The model here is simply an abstraction on top of the data persistent layer, which is PostgreSQL. It’s interface includes create, all, find-by-id, delete-all, delete, and update-todo. I’m using clojure.java.jdbc, which is just a Cojure wrapper for JDBC-based access to the database.

```clojure
(defn all []
  (vec (sql/query spec ["select * from todos"] {:row-fn parse})))

(defn create [todo]
  (parse (first (sql/insert! spec :todos (order-to-position todo)))))

(defn find-by-id [id]
  (first (sql/query spec ["select * from todos where id = ?::integer" id] {:row-fn parse})))

(defn update-todo [id todo]
  (sql/update! spec :todos (order-to-position todo) ["id = ?::integer" id])
  (find-by-id id))

(defn delete [id]
  (sql/delete! spec :todos ["id = ?::integer" id]))

(defn delete-all []
  (sql/delete! spec :todos []))
```

I also wrote some helpers for setting up and populating the database in the migration.clj - migrate, drop-db, and populate. They can be executed as leiningen commands, which I’ve setup via aliases in project.clj.

```clojure
  :aliases {"migrate" ["run" "-m" "todo-clj.models.migration/migrate"]
            "populate" ["run" "-m" "todo-clj.models.migration/populate"]
            "drop-db" ["run" "-m" "todo-clj.models.migration/drop-db"]}
```

That completes a tour of the back-end portion of this app. I will cover the front-end, ClojureScript portion of this app in the next blog post.

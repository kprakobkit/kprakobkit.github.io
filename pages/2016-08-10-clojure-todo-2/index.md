---
title: Clojure Todo - 2 of 2
date: "2016-08-10"
layout: post
path: "/clojure-todo-2/"
publish: true
---

This is the second part of a two-part walkthrough of a todo app that I build in Clojure. The first part covers the backend portion of the app - server and database. I will be covering the front-end, ClojureScript, portion of the app. Let's get started!

Note: The source code is available [here](https://github.com/kprakobkit/todo-clj).

I'm using [Om](https://github.com/omcljs/om), which is a ClojureScript interface to Facebook's React. It's written by David Nolen, and it's awesome. An alternative to this is [Reagent](https://reagent-project.github.io/). David Nolen has written some very good documentation around this library as well, and most of what you'll see here is taken from his [tutorials](https://github.com/omcljs/om/wiki).

The front-end portion is essentially a separate client-side app that interacts with a todo-api, which is the server. The entry point is in core.cljs, where the intial app state and the main app component are defined.

```clojure
(defonce app-state (atom {:todos []}))

(om/root
 app/app
 app-state
 {:target (js/document.getElementById "app")})
```

The app state is very simple; it's just an atom with an empty list of todos. The app component's `will-mount` function is where we will first get all the todos and populate the app state.

```clojure
(defn app [app owner]
  (reify
    om/IInitState
    (init-state [_]
      {:delete (chan)
       :update (chan)
       :title ""})
    om/IWillMount
    (will-mount [_]
      (let [delete (om/get-state owner :delete)
            update (om/get-state owner :update)]
        (get-todos app)
        (go (loop []
              (let [[todo chan] (alts! [delete update])]
                (condp = chan
                  delete (remove-todo! app todo)
                  update (add-todo! app todo))
                (recur))))))
    om/IRenderState
    (render-state [this {:keys [delete title update]}]
      (dom/div nil
        (dom/h1 nil "My Todo")
        (dom/input #js {:ref "new-todo"
                        :type "text"
                        :placeholder "What needs to be done?"
                        :value title
                        :onChange #(handle-change % owner)
                        :onKeyPress #(handle-key-press % app owner)} nil)
        (apply dom/ul nil
          (map
           (fn [todo]
             (om/build todo-view todo
                       {:react-key (:id todo)
                        :init-state {:delete delete
                                     :update update}}))
           (:todos app)))))))
```
Also notice in `will-mount` that a go loop is established to listen for events on the `delete` and `update` channels. If you are not familiar with channels, checkout this [tutorial](https://github.com/omcljs/om/wiki/Basic-Tutorial). The channels themselves are initialized in the `init-state` function and are used as the means for intercomponent communication, i.e. a todo component can put a new title for a new todo on the update channel, which will get picked up by the go loop, creating the new todo. I'm still very new to this but what I've seen so far is very cool.

The app component is also responsible for rendering a todo component for each todo in the list.

```clojure
(defn todo-view [todo owner]
  (reify
    om/IInitState
    (init-state [_]
      {:editing false})
    om/IRenderState
    (render-state [_ {:keys [delete update editing]}]
      (dom/li #js {:key (str (:id todo) (rand)) :className "todo"}
              (dom/span #js {:style (display (not editing))
                             :onDoubleClick #(om/set-state! owner :editing true)}
                        (:title todo))
              (dom/input #js {:ref "edit-todo"
                              :value (:title todo)
                              :autoFocus true
                              :style (display editing)
                              :onBlur #(save-todo todo owner)
                              :onChange #(handle-change % todo)})
              (dom/input #js {:type "checkbox"
                              :checked (:completed todo)
                              :onClick #(update-todo todo {:completed (not (:completed todo))} (fn [updated-todo] (put! update updated-todo)))})
              (dom/button #js {:className "todo__remove"
                               :onClick #(remove-todo todo (fn [_] (put! delete @todo)))} "x")))))
```

Each todo is responsible for rendering the details for each todo. Also take note that each todo receives the update and delete channels. One interesting functionality in the todo-component is that double clicking on the title changes the text field (span) into an input field. This is controlled by the value of `:editing` in the component's state. This is also very cool! The `onClick` handlers for the checkbox and delete buttons put values on the update and delete channels, respectively.

I've also abstracted all the interactions with the api, our server, into the actions.cljs file.

```clojure
(defn get-todos [app]
  (GET "/todos" {:handler #(handler % app)
                 :keywords? true
                 :response-format :json}))

(defn remove-todo [todo handler]
  (let [url (:url todo)]
    (DELETE url {:handler handler
                 :error-handler trace
                 :format :json})))

(defn update-todo [todo updates handler]
  (PATCH (:url todo) {:handler handler
                      :error-handler trace
                      :params updates
                      :format :json
                      :response-format :json
                      :keywords? true}))

(defn add-todo [cursor owner]
  (let [title (om/get-state owner :title)]
    (POST "/todos" {:handler (fn [res]
                               (om/transact! cursor :todos (fn [todos] (conj todos res)))
                               (om/set-state! owner :title ""))
                    :error-handler trace
                    :params {:title title}
                    :format :json
                    :response-format :json
                    :keywords? true})))
```

Here, I'm using the [cljs-ajax library](https://github.com/JulianBirch/cljs-ajax), which is a neat wrapper for making ajax calls.


That completes a tour of the front-end portion of this app. I will cover setting up a CI environment from scratch in the next blog post. Thanks for reading!

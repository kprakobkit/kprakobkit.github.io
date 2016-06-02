---
title: PostgreSQL Permissions - Database and Table
date: "2015-06-02"
layout: post
path: "/postgresql-permissions/"
---

Today I learned that there's granting permissions to a **database** and to a **table** for a user in PostgreSQL. I've been banging my head for about a week on an issue where a user didn't have the appropriate rights and stumbled upon [this](http://stackoverflow.com/questions/15520361/permission-denied-for-relation), which did it for me.

Thank you to those that contributed on Stack Overflow. I'm hoping to pay it forward by writing this post to explain the issue in some detail and summarize my learnings.

**Background:** I'm building a todo app in clojure using the Om/Compojure/Ring/PostgreSQL stack as a learning project. I am also deploying this on [DigitalOcean](https://www.digitalocean.com/) manually to learn what's involved in deploying onto a VPS and setting up a CI/CD pipeline, you know, the whole shebang. At the time of this writing, I've built the backend web services for the app, following these [specs](http://www.todobackend.com/) and am in the process of setting it up on digital ocean.

The clojure app is deployed, but I got this error whenever I hit the `/todos` endpoint. I'm also using [nginx](https://nginx.org/en/) as a reverse proxy.

```sql
ERROR: permission denied for relation todos
```

This was because **www-data**, the user used by nginx, did not have permissions to read from the **todos** table.

I had initially granted the user access to the database with

```sql
GRANT ALL PRIVILEGES ON DATABASE todos to "www-data";
```

This, however, only gave the user `CREATE`, `CONNECT`, `TEMPORARY` (or `TEMP`) privileges on the **database**.

The solution was to do

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "www-data";
```

Another learning for me is the [public schema](https://www.postgresql.org/docs/9.1/static/ddl-schemas.html), `SCHEMA public`, which is just the default schema that all tables are added to unless one is specified.

___
* https://www.postgresql.org/docs/current/static/sql-grant.html

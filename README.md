
# App created for managing a couple's expenses

## Features

### App's objective
Com o objetivo de ajudar no gerenciamento das despesas de um casal, esta aplicação mantém o cadastros das depesas que cada um realiza durante o mês e apresenta a relação de despesas cadastradas e seus valores juntamente com a diferença entre o total de cada, com sua própria visão.

The goal of this application is helping in the expenses management of a couple. It keeps the expenses register that each one fills during the month and presents a dashboard of the registered expenses and it amounts 


A simple CRUD app backend built in nodejs + typescript with:

* User authentication
* User creation
* User's avatar upload and update
* Appointment creation
* Appointment listing

## Technologies

* NodeJs 12
* Typescript
* Express
* JsonWebToken
* Typeorm
* Postgresql
* Docker

## Installation Guide

1. Run "docker run --name [container_name] -e POSTGRES_PASSWORD=[password] -p 5434:5432 -d postgres" to deploy a postgresql docker container
2. Run "npm install" do install all the dependencies
3. Run "npx typeorm migration:run" to execute all the needed migrations
4. Run "npm run dev:server" to bootstrap the development server

## How to use

* Make a post request with the following payload on the route /users to create a new user:
```
{
  "name": "username",
  "email": "user@email.com",
  "password": "password"
}
```

* Make a post request with the following payload on the route /sessions to create a session:
```
{
  "email": "user@email.com",
  "password": "password"
}
```

###### The header of the next routes must contain the Bearer token provided by the session route
* Make a post request with the following payload on the route /appointments to create an appointment

```
{
	"provider_id": "[user_id]",
	"date": "[timestamp iso-8601]"
}
```

* Make a get request on the route /appointments to list the appointments

<!--stackedit_data:
eyJoaXN0b3J5IjpbNjI5NDMyNzE1LC0xMDQ0MDE4MjMyXX0=
-->
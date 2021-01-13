
# App created for managing a couple's expenses

## Features

### App's objective

The goal of this application is helping in the expenses management of a couple. It keeps the expenses register that each one fills during the month and presents a dashboard of the registered expenses, it's amounts and the total difference between each person.


 The backend is build in nodejs + typescript with the following:

* User authentication
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
eyJoaXN0b3J5IjpbMTQ2MTI0ODY3NSwtMTA0NDAxODIzMl19
-->
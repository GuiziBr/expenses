
# App created for managing a couple's expenses

## Features

### App's objective

The goal of this application is helping in the expenses management of a couple. It keeps the expenses register that each one fills during the month and presents a dashboard of the registered expenses, it's amounts and the total difference between each person.


 The backend is build in nodejs + typescript with the following:

* User authentication
* User creation
* Upload user's avatar
* Expense creation
* Expense + balance listing

## Technologies

* NodeJs 12
* Typescript
* Express
* JsonWebToken
* Typeorm
* Postgresql
* Docker

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

* Make a post request with the following payload on the route /expenses to create an appointment

```
{
	"description": [string],
	"date": "[2021-01-01]",
	"amount": [number]
}
```

* Make a get request on the route /expenses/balance to list the expenses and the current balance

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIwNDU4ODU1NzEsLTEwNDQwMTgyMzJdfQ
==
-->
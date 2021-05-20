
# App created for managing a couple's expenses

## Features

### App's objective

The goal of this application is helping in the expenses management of a couple. It keeps the expenses register that each one fills during the month and presents a dashboard of the registered expenses, it's amounts and the total difference between each person.


 The backend is built with nodejs + typescript containing the following features:

* User authentication
* User creation
* Upload user's avatar
* Expense creation
* Personal/Shared balance
* Expenses listing
* Category creation
* Payment Type creation

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

###### The header of the following routes must contain the Bearer token provided by the session route

* Make a post request with the following payload on the route /expenses to create an expense

```
{
	"description": [string],
  "category_id": [string]
	"date": "[2021-01-01]",
	"amount": [number]
  "personal":[boolean]
  "split": [boolean]
  "payment_type_id": [string]
}
```

* Make a patch request of type multipart with the following payload on the route /users/avatar to upload the user's avatar

```
{
	"avatar": [jpeg/png file format]
}

```
* Make a get request on the route /balance?date=YYYY-MM to get both the personal and shared balance for the provided user

* Make a get request on the route /expenses/balance?date=YYYY-MM to list the expenses and the balance for a either specif or current month

* Make a get request on the route /expenses/personalBalance?date=YYYY-MM to list the expenses and the balance for the provided user and an either specif or current month

* Make a post request with the following payload on the route /categories to create a category

```
{
	"description": [string],
}
```

* Make a get request route /categories to list all the register categories

* Make a post request with the following payload on the route /paymentType to create a payment type

```
{
	"description": [string],
}

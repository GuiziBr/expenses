
# App created for managing a couple's expenses

## Features

### App's objective

The following application's description takes into consideration both the [Back-end](https://github.com/GuiziBr/expenses) and the [Front-end](https://github.com/GuiziBr/expenses_portal)

This application aims to help manage household expenses. Each person should register their own expenses throughout the month so the application can keep track and calculate the difference between each person's spending. It presents dashboards for both personal and shared expenses together with the total amount for incomes, outcomes and balance.

The backend is built with nodejs + typescript containing the following features:

* User authentication
* User creation
* Upload user's avatar (in development)
* Expense creation
* Personal expenses listing
* Shared expenses listing
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

## Requirements

* NodeJs 12 or latest
* Docker Compose

## How to install

 1. Clone this repository
 2. Install dependencies with `npm install`
 3. Run `make` command to install database container, migrations and start the server

## How to use the back-end api's

For API documentation refer to [Swagger](https://food-expenses.herokuapp.com/doc/)

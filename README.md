
# App created for managing a couple's expenses

## Features

### App's goal

The following application's description takes into consideration both the [Back-end](https://github.com/GuiziBr/expenses) and the [Front-end](https://github.com/GuiziBr/expenses_portal)

This application aims to help manage household expenses. Each person should register their own expenses throughout the month so the application can keep track and calculate the difference between each person's spending. It presents the following:

- Shared Dashboard => shared expenses list between each person's spending
- Personal Dashboard => expenses list for the current user
- Shared Balance => consolidated balance between each person's spending for selected month filtered by either category or payment type
- Bank management => manage the bank list used for creating expenses
- Category management => manage the category list used for creating expenses
- Payment Type management => manage the payment type list used for creating expenses
= Store management => manage the store list used for creating expenses

The backend is built with nodejs + typescript containing the following features:

* User authentication
* User creation
* Upload user's avatar (in development)
* Expense creation
* Personal expenses listing
* Shared expenses listing
* Consolidated expenses
* Bank list/get/create/update/delete
* Category list/get/create/update/delete
* Payment Type list/get/create/update/delete
* Store list/get/create/update/delete

## Technologies

* NodeJs 14
* Typescript
* Express
* JsonWebToken
* Typeorm
* Postgresql
* Docker

## Requirements

* NodeJs 14 or latest
* Docker Compose

## How to install

 1. Clone this repository
 2. Create an `.env` file following the `.env.example`
 3. Install dependencies with `npm install`
 4. Run `make` command to install database container, migrations and start the server

## How to use the back-end api's

For API documentation refer to [Swagger](https://food-expenses.herokuapp.com/doc/)

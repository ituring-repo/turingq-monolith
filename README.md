# TuringQ - Monolithic Application

## Introduction

This repository contains the monolithic version of the TuringQ application.

The application is backed by NodeJS and [AdonisJS](https://adonisjs.com). Its primary purpose is to solve
a use case of a **Questions and Answers** application (some users create questions and wait for the others
to answer).

The use cases above are exposed by an API detailed on the [API](#api) section.

## Prerequisites

You need [Docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/).

## Starting development environment

The development environment has a docker-compose configuration starting a PostgreSQL database and a
development Node.js container. You should define a password for the PostgreSQL database while starting
the development environment with docker-compose. Create a `.env` file following the `.env.example`
in the repository. The docker-compose will load the database variables from this file.

You can run the following command to start the containers:

```
docker-compose up
```

## Environment Variables

The environment variables can be found at the **.env** file, which should be created based on the
**.env.example** file.

If you do not create the **.env** file, the application and the database container will not work properly.

### Variables Description

#### App

These are the basic variables needed for the app to run.

- **PORT:** Port used to run the server.
- **HOST:** Host used to run the server.
- **NODE_ENV:** Determines the environment the application is running in (that way, you can have custom configurations for developer/production environments).
- **APP_KEY:** Key used by the app to handle internal features (such as cookie session, etc.)
- **AUTH_TOKEN_EXPIRATION_MINUTES:** Expiration time for the authentication tokens generated inside the server.

#### Database

These are the variables needed to configure the app database.

- **PAGINATION_LIMIT:** Default limit for paginating database queries.
- **DB_CONNECTION:** Type of database connection(per example pg that means PostgreSQL).
- **PG_HOST:** Host for PostgreSQL.
- **PG_PORT:** Port for PostgreSQL.
- **PG_USER:** User for PostgreSQL.
- **PG_PASSWORD:** Password for PostgreSQL.
- **PG_DB_NAME:** Name of the database inside PostgreSQL.

#### Mailer

These are the variables needed to configure the app mailer service.

- **SMTP_HOST:** Host of the SMTP server.
- **SMTP_PORT:** Port of the SMTP server.
- **SMTP_USERNAME:** Username of the SMTP server.
- **SMTP_PASSWORD:** Password of the SMTP server.
- **MAIL_FROM:** Default e-mail address for sending mails.

## Docker Containers

This app needs some resources in order to work, such as a database. Being minded about it, we use Docker
Containers to handle it as easily as possible.

The Docker Container setup can be found inside [docker-compose.yml](docker-compose.yml), and we are using an
official Docker image to create a local PostgreSQL database.

## Running the application

You must have Node.js 16+ installed in your machine. Download it at [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

You can also use NVM (Node Version Manager): [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).

Check the remainder of this section to see how to run the application in development and production modes.

### Development mode

Clone this repository and run the commands below:

```sh
docker-compose up -d
cp .env.example .env
```

Please edit the new `.env` file accordingly and proceed with the commands below:

```sh
npm install
node ace migration:run
npm run dev
```

### Running production build

Build the application:

```sh
npm run build
```

You can now upload the directory `build` content to your production server.

Before running the application on your production server, you must install the dependencies
and set up the environment variables. Several production servers have a place to set up the
environment variables. Alternatively, you can create a `.env` file and set up your variables
there. However, prefer using the infrastructure available by your provider to deploy your
application instead. Remember to update the values of your environment variables according
to your production environment.

With your environment variables ready, you should install the dependencies and initialize your
database. Do not run the steps below in your local machine. Some dependencies might not work
in your production environment if you do so (e.g., some libraries installed in your Windows or
Mac environment simply do not run in a GNU/Linux production machine). You should run the steps
below during the setup of your production environment.

```sh
npm ci --production
node ace migration:run --force
```

Everything is ready now. You can start the application:

```sh
node server.js
```

## API

### Authorization

Some routes need authorization to work. The token must be supplied in the following way:

- Request Header: **Key:** Authorization / **Value:** Bearer TOKEN

### Endpoints

#### Registration

- **POST /registration:** Create a new user.

Body:

```json
{
  "name": "USER_NAME",
  "email": "USER_EMAIL",
  "password": "USER_PASSWORD",
  "password_confirmation": "USER_PASSWORD"
}
```

#### Authentication

- **POST /auth/login:** Authenticate an existing user.

Body:

```json
{
  "email": "USER_EMAIL",
  "password": "USER_PASSWORD"
}
```

- **GET /auth/logout:** Invalidate the authentication of the current authenticated user. [Requires Authorization](#authorization)

#### Questions

- **GET /questions:** Retrieve the questions. [Requires Authorization](#authorization)

Query Params:

```
page: The page number.
limit: The maximum results per page.
```

- **POST /questions:** Create a question. [Requires Authorization](#authorization)

Body:

```json
{
  "title": "QUESTION_TITLE",
  "body": "QUESTION_BODY"
}
```

- **PUT /questions/QUESTION_ID:** Update a question (and create in case it does not exist). [Requires Authorization](#authorization)

Body:

```json
{
  "title": "QUESTION_TITLE",
  "body": "QUESTION_BODY"
}
```

- **DELETE /questions/QUESTION_ID:** Delete a question. [Requires Authorization](#authorization)

#### Answers

- **GET /questions/QUESTION_ID/answers:** Retrieve the answers for a selected question. [Requires Authorization](#authorization)

Query Params:

```
page: The page number.
limit: The maximum results per page.
```

- **POST /questions/QUESTION_ID/answers:** Create an answer for a question. [Requires Authorization](#authorization)

Body:

```json
{
  "body": "ANSWER_BODY"
}
```

- **PUT /questions/QUESTION_ID/answers/ANSWER_ID:** Update an answer (and create in case it does not exist). [Requires Authorization](#authorization)

Body:

```json
{
  "body": "ANSWER_BODY"
}
```

- **DELETE /questions/QUESTION_ID/answers/ANSWER_ID:** Delete an answer. [Requires Authorization](#authorization)

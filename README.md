## Description

Ivan - Seek Tech Assessment.

## Project setup

```bash
$ npm install
$ npm run prisma:generate
```

### Run migration and seed

PLEASE RUN SEED FIRST TO GET INITAL DATA

Add PostgreSQL connection string in env as DATABASE_URL.  
Refer to .env.example

```bash
## Run migration
$ npm run prisma:deploy

## Run seed
$ npm run seed
```


## Compile and run the project

```bash
## Start API

$ npm run start:dev

## Run tests

```bash

$ npm run test

```
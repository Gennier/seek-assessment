## Description

Ivan - Seek Tech Assessment.
PLEASE RUN SEED FIRST TO GET INITAL DATA


## Project setup

```bash
$ npm install
$ npm run prisma:generate
```

### Run migration and seed

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

## Assessment endpoints

[GET] /product/list

[GET] /promotion/list

[POST] /checkout
```bash
Example body: 
{
    "orders": [
        {
            "productId": "ed35899e-8fe4-4dc4-8e60-be5f95fbf4e5",
            "quantity": 5
        },
        {
            "productId": "87ce931e-6c20-43e6-9b58-21dd3f604058",
            "quantity": 3
        }
    ],
    "promotionCode": "myer333"
}
```



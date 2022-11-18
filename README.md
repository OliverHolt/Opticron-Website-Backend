# Northcoders News API

## Link to host

https://long-pink-goat-wear.cyclic.app/

## Background

The link above will take you to the backend of an API I built which will fetch news articles.

The intention here is to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

## Cloning this repo

As .env.\* is added to the .gitignore, anyone who wishes to clone this repo will not have access to the necessary environment variables.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## Seeding the database & Running tests

These scripts (and others) can be found in the package.json. Seeding the database can be done by running the seed script (npm run seed) and tests can be run through npm run test.

## Software requirements

This API was built using Node.js version v18.7.0 and Postgres version 14.5 on Ubuntu

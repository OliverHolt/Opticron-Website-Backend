# NipToLoo API

## Link to host

https://cyan-cormorant-gear.cyclic.app/api/

## Background

The link above will take you to the backend of NipToLoo's RESTful API. The link will show all available endpoints of the API.

NipToLoo is a mobile application to help users locate public toilets in their current location or a specified area in the UK or all over the world. We specifically designed this app for people with conditions like irritable bowel syndrome(IBS), Crohn’s disease, and parents and minders requiring a safe space to change diapers. The app will help plan their toilet breaks ahead of any trips to an unfamiliar place.

For more information, please see our front-end repo here: https://github.com/AngelikaM-T/NipToLoo

## Cloning this repo

As .env.\* is added to the .gitignore, anyone who wishes to clone this repo will not have access to the necessary environment variables.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## Seeding the database & Running tests

These scripts (and others) can be found in the package.json. Seeding the database can be done by running the seed script (npm run seed) and tests can be run through npm run test.

## Software requirements

This API was built using Node.js version v18.7.0 and Postgres version 14.5 on Ubuntu

# Storefront Backend Project

this is an storefront backend api created for the advanced web developement course

## Getting Started

- clone this repo and run `yarn` in your terminal at the project root.
- in psql you need to create a new user
  to do this run `CREATE USER <username> WITH PASSWORD '<password>';`
- in psql you need to create two new databases
  one for development and one for testing
  to do this run

```
CREATE DATABASE <database_name>;
CREATE DATABASE <database_name>_test;
```

- in psql you need to grant user all previledges to the databases you created above in the previous step
  to do this run

```
GRANT ALL PRIVILEGES ON DATABASE <database_name> TO <username>;
GRANT ALL PRIVILEGES ON DATABASE <database_name>_test TO <username>;
```

- run database on port 5432
- then create a .env file in the root directory with the following contents:

```
  POSTGRES_HOST
  POSTGRES_DB
  POSTGRES_TEST_DB
  POSTGRES_USER
  POSTGRES_PASSWORD
  ENV
  BCRYPT_PASSWORD
  SALT_ROUNDS
  TOKEN_SECRET
```

- and then create a database and run `db-migrate up` to create the tables after creating the database.json file.
- then run `yarn start` to start the server it will run on port 3000.

# Backend

## Description

Backend of Vinculation

## Installation

### Vscode

You need this complements:

- Eslint
- Gitlens
- Prettier

### Files

you need following files:

- .env (For environments)

### Without docker

1. Prerequisites

- node 20: [Installation Instructions](https://nodejs.org/en/download/package-manager/current)


### With docker

1. Prerequisites

- Docker: [Installation Instructions](https://docs.docker.com/get-docker/)
- Docker Compose: [Installation Instructions](https://docs.docker.com/compose/install/)

2. Run app

```bash
# build
$ docker-compose up --build

# start
$ docker-compose up

# stop
$ docker-compose down
```

## Generate Migration

To generate migrations make this

```bash
# Generate the migration in LINUX (inside of "", put the name of the migration)
$ npm run migration:generate --name="name_of_migration"

#Or

# Generate the migration in WINDOWS (inside of "", put the name of the migration)
npm run migration:generate:win --name=RelationsTemplate

# Run the migration
$ npm run migration:run
```

When you make a "migrate:generate", automatically put the file inside of Migration directory
So not put the directory to generate the migration

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

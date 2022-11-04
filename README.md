## Description

Describe programming using `nestjs`, `redis`, `grpc`, `typeorm`.

## TODO

-   set dtoFileNameSuffix i nest-cli.json. .entity.ts -> .record.ts

## Design

-   A simple entity of CRUD uses `Active Record`. Complex entities use the `Data Mapper` style.
-   `src/common` is a common library that can be used in other nestjs projects.
-   Because the DDD uses the entity concept, the `.entity.ts` file created by `nest cli` is changed to `.record.ts` and the class name is also appended with `Record` suffix.<br>
    The reason for record is that it is information recorded in DB by typeorm.

## Development

1. 최초 구현은 controller인가? domain인가?\
   DDD는 도메인 주도 디자인이다. 구현 순서는 다를 수 있다. \
   항상 실행 가능한 상태를 유지하는 것이 개발에 유리하고 최상위 인터페이스/레이어에서 하향식으로 개발하는 것이 바람직하다.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

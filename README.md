## Description

postStartCommand": "docker run -d --network vscode --name plantuml plantuml/plantuml-server:jetty

Describe programming using `nestjs`, `redis`, `grpc`, `typeorm`..

## Development

1. 최초 구현은 controller인가? domain인가?\
   DDD는 도메인 주도 디자인이다. 구현 순서는 다를 수 있다. \
   항상 실행 가능한 상태를 유지하는 것이 개발에 유리하고 최상위 인터페이스/레이어에서 하향식으로 개발하는 것이 바람직하다.

## Design

-   A simple entity of CRUD uses `Active Record`. Complex entities use the `Data Mapper` style.
-   `src/common` is a common library that can be used in other nestjs projects.
-   Because the DDD uses the entity concept, the `.entity.ts` file created by `nest cli` is changed to `.record.ts` and the class name is also appended with `Record` suffix.\
    The reason for record is that it is information recorded in DB by typeorm.
-   HATEOAS or HAL is implemented in the controller. However, it is not implemented here. Supporting full self descriptives is difficult and complicated. If you really need self description, you can use GRPC as an alternative.

    ```sh
    curl -u admin:admin -X GET "http://localhost:8080/confluence/rest/api/space/ds/content/page?limit=5&start=5"
    ```

    ```json
    {
        "_links": {
            "base": "http://localhost:8080/confluence",
            "context": "",
            "next": "/rest/api/space/ds/content/page?limit=5&start=5",
            "self": "http://localhost:8080/confluence/rest/api/space/ds/content/page"
        },
        "limit": 5,
        "results": [
            {
                "_expandable": {
                    "ancestors": "",
                    "children": "/rest/api/content/98308/child",
                    "history": "/rest/api/content/98308/history",
                    "version": ""
                },
                "_links": {
                    "self": "http://localhost:8080/confluence/rest/api/content/98308",
                    "webui": "/pages/viewpage.action?pageId=98308"
                },
                "id": "98308",
                "status": "current",
                "title": "What is Confluence? (step 1 of 9)",
                "type": "page"
            }
        ],
        "size": 5,
        "start": 0
    }
    ```

## Installation

```bash
$ npm install
```

## Production deploy

```bash
# build
$ npm run build

# run
$ npm start
```

## Running the app

```bash
# watch mode
$ npm run dev
```

## Test

```bash
# watch mode
$ npm test

# test all & coverage
$ npm run test:unit
```

# practice

## Todo

1. useMocker가 생겼다 유닛 테스트 재검토해라
1. API gateway는 REST+gRPC클라이언트+rabbitmq클라이언트, auth service는 gRPC서버+rabbitmq수신, users는 rabbitmq,
1. controller가 REST냐 microservice냐에 따라 exception이 달라진다. HttpException 혹은 RpcException이다.
   그러니까 service에서는 HttpException을 직접 던지지 말아라. Domain Exception을 던져야 한다.
1. 테스트 상세하게
    1. auth 테스트 작성해야 한다.
    1. users의 domain/service 작성 안 했다.
1. auth/etc 정리 좀 하자
1. README 정리
1. logstash, elastic search, kibana 적용

## 설계

-   typeorm 관련 소스가 응집성을 갖도록 entity를 포함한 모든 파일들을 /typeorm에 모아놨다.

### Unit Test

-   fixture/sut/actual/expected/verify 순서로 구성했다.
-   변수명은 user/file 등 내용이 아니라 sut/fixture 등 역할에 따라 명명했다.
    unit test에서 의미 보다는 역할이 중요하다

## Debugging

-   test를 비롯한 모든 디버깅 모드(`node --inspect`)로 실행 중인 프로세스는 `.vscode/launch.json`의 `Attach`를 사용한다.
-   `.spec.ts`에 정의된 테스트는 `npm test`를 하지 말고 각 테스트 항목에서 run/debug를 클릭해서 실행한다.
    <img src="./docs/test-buttons.png" width="377" alt="" />

## Running

이 프로젝트에 필요한 기본 인프라는 아래 스크립트를 실행한다.

```bash
sh scripts/docker_infra_bootup.sh
sh scripts/memory_infra_bootup.sh
```

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

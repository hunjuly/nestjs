import { ConflictException } from '@nestjs/common'

// 원칙은 domain의 exception을 정의하는 것이 맞다.
// 그러나 여기서는 platform이 제공하는 HttpException을 사용한다.
// domain exception정의는 지나치게 중복 작업이다.
// 아래 exception은 예제로 그냥 둔다.
export class AlreadyExistsException extends ConflictException {
    constructor(message = 'already exists user') {
        super(message)
    }
}

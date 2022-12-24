import { BadRequestException, NotFoundException } from '@nestjs/common'

export class InternalError extends Error {}

declare global {
    const Expect: {
        found(con: any, message?: string)
        success(con: any, message?: string)
    }

    const Assert: {
        truthy(con: any, message: string)
        null(con: any, message: string)
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any

/// 사용자 요청 검증
class Expect {
    static found(con: any, message?: string) {
        if (!con) throw new NotFoundException(message)
    }

    static success(con: any, message?: string) {
        if (!con) throw new BadRequestException(message)
    }
}
g.Expect = Expect

/// 시스템 로직 검증. 실패하면 말 그대로 시스템 오류다.
class Assert {
    static truthy(con: any, message: string) {
        if (!con) throw new InternalError(message)
    }

    static null(con: any, message: string) {
        if (con) throw new InternalError(message)
    }
}
g.Assert = Assert

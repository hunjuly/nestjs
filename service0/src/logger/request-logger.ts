import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

// 실제 product라면 이것은 불필요하다.
// practice이기 때문에 middleware 연습으로 만든 것 뿐이다.
@Injectable()
export class RequestLogger implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        Logger.verbose('Request', req.method, req.url)
        next()
    }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { AlreadyExistsDomainException, DomainException, NotFoundDomainException } from 'src/common/domain'
import { Assert } from '../assert'

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    async catch(exception: DomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const body = {
            message: exception.message,
            path: request.url,
            timestamp: new Date().toISOString()
        }

        if (exception instanceof AlreadyExistsDomainException) {
            response.status(HttpStatus.CONFLICT).json(body)
        } else if (exception instanceof NotFoundDomainException) {
            response.status(HttpStatus.NOT_FOUND).json(body)
        } else {
            Assert.fail(`unknown exception(${typeof exception})`)
        }

        Logger.warn(`${request.method} ${request.url}, ${exception.message}`)
    }
}

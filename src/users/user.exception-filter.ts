import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { Assert } from 'src/common'
import { AlreadyExistsUserException, DomainException, NotFoundUserException } from './domain'

@Catch(DomainException)
export class UserExceptionFilter implements ExceptionFilter {
    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        if (exception instanceof DomainException) {
            const body = {
                message: exception.message,
                path: request.url,
                timestamp: new Date().toISOString()
            }

            if (exception instanceof AlreadyExistsUserException) {
                response.status(HttpStatus.CONFLICT).json(body)
            } else if (exception instanceof NotFoundUserException) {
                response.status(HttpStatus.NOT_FOUND).json(body)
            } else {
                Assert.fail(`unknown exception(${typeof exception})`)
            }

            Logger.warn(`${request.method} ${request.url}, ${exception.message}`)
        }
    }
}

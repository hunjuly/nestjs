import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class ExceptionLogger implements ExceptionFilter {
    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        if (exception instanceof HttpException) {
            const status = exception.getStatus()

            const body = {
                statusCode: status,
                message: exception.message,
                path: request.url,
                timestamp: new Date().toISOString()
            }

            Logger.warn(`${request.method} ${request.url}, ${status}, ${exception.message}`)

            response.status(status).json(body)
        } else if (exception instanceof Error) {
            const body = {
                statusCode: 500,
                message: exception.message,
                path: request.url,
                timestamp: new Date().toISOString()
            }

            Logger.error(`${request.method} ${request.url}, 500, ${exception.message}, ${exception.stack}`)

            response.status(500).json(body)
        } else {
            const body = {
                statusCode: 500,
                message: 'UNKNOWN ERROR!',
                path: request.url,
                timestamp: new Date().toISOString()
            }

            Logger.error(body)

            response.status(500).json(body)
        }
    }
}

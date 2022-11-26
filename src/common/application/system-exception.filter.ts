import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppService } from 'src/app.service'
import { SystemException } from '../assert'

@Catch(SystemException)
export class SystemExceptionsFilter implements ExceptionFilter {
    constructor(private readonly appService: AppService) {}

    catch(exception: SystemException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const body = {
            message: exception.message,
            path: request.url,
            timestamp: new Date().toISOString()
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body)

        Logger.error(`${request.method} ${request.url}, ${exception.message}`)

        this.appService.shutdown()
    }
}

import { Logger } from '@nestjs/common'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

// Guard에서 필터링 되는 request는 여기까지 오지 못한다.
// 그래서 실행 후 성공 결과만 기록한다.
// 모든 요청을 기록하려면 NestMiddleware로 만들어야 한다. 단, 이것은 결과는 기록하지 못함

@Injectable()
export class SuccessLogger implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const now = Date.now()

        const request = context.switchToHttp().getRequest()

        const body = JSON.stringify(request.body)

        const response = context.switchToHttp().getResponse()

        return next.handle().pipe(
            tap({
                complete: () =>
                    Logger.log(
                        `${request.method} ${request.url}, ${Date.now() - now}ms, ${
                            response.statusCode
                        }, ${body}`
                    )
            })
        )
    }
}

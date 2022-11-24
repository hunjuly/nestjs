import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        // super.canActivate() 하면 LocalStrategy.validate() 한다.
        // validate()의 리턴값({ userId, email })을 request.user에 기록한다.
        const result = (await super.canActivate(context)) as boolean

        // logIn() 하면 serializeUser(request.user) 호출해서 response.set-cookie를 설정한다.
        // serializeUser는 Passport에서 정의한 인터페이스다
        await super.logIn(context.switchToHttp().getRequest())

        return result
    }
}

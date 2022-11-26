import { SetMetadata } from '@nestjs/common'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { SessionUser } from '../types'
import { IS_PUBLIC_KEY } from './public'

// nestjs self guard 검색
// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6

interface SelfDecoratorParams {
    userIDParam: string
    allowAdmins?: boolean
}

export const Self = (params: SelfDecoratorParams | string) =>
    SetMetadata('selfParams', typeof params == 'string' ? { userIDParam: params } : params)

@Injectable()
export class SelfGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user as SessionUser

        if (!user) return false

        const { allowAdmins, userIDParam } = this.getOption(context)

        if (allowAdmins && user.role === 'admin') return true

        return request.params[userIDParam] === user.id
    }

    private getOption(context: ExecutionContext) {
        let selfParams = this.reflector.get<SelfDecoratorParams>('selfParams', context.getHandler())

        if (!selfParams) {
            selfParams = this.reflector.get<SelfDecoratorParams>('selfParams', context.getClass())
        }

        if (!selfParams) {
            selfParams = { userIDParam: 'id', allowAdmins: true }
        }

        return selfParams
    }
}

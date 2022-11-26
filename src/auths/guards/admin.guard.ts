import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SessionUser } from '../types'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
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

        return user.role === 'admin'
    }
}

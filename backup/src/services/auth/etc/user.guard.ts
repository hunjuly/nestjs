import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

const IS_PUBLIC_KEY = 'isPublic'

@Injectable()
export class UserGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true
        }

        return context.switchToHttp().getRequest().isAuthenticated()
    }
}

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

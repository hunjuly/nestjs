import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
// import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()

        if (request.user.role !== 'admin') return false

        return request.isAuthenticated()
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { AuthsService } from './auths.service'

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private authService: AuthsService) {
        super()
    }

    serializeUser(user: any, done: (err: Error, user: any) => void) {
        done(null, user)
    }

    async deserializeUser(user: any, done: (err: Error, payload: any) => void) {
        const auth = await this.authService.findByUserId(user.id)

        if (auth) {
            const user = {
                id: auth.userId,
                email: auth.email,
                role: auth.role
            }

            done(null, user)
        } else {
            done(new UnauthorizedException('expired token'), undefined)
        }
    }
}

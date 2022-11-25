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

    async deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
        const res = await this.authService.findByEmail('memberA@mail.com')
        console.log('deserializeUser', res)
        done(new UnauthorizedException('expired token'), undefined)

        // done(null, payload)
    }
}

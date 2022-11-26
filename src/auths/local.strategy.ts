import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthsService } from './auths.service'

type Payload = {
    id: string
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthsService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<Payload> {
        const auth = await this.authService.findByEmail(email)

        if (!auth) throw new UnauthorizedException(`${email} not found.`)

        const isValid = await this.authService.validate(auth.userId, password)

        if (!isValid) {
            throw new UnauthorizedException()
        }

        return { id: auth.userId }
    }
}

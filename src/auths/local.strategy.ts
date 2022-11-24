import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthsService } from './auths.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthsService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const auth = await this.authService.findByEmail(email)

        if (!auth) throw new UnauthorizedException(`${email} not found.`)

        const isCorrect = await this.authService.validate(auth.userId, password)

        if (!isCorrect) {
            throw new UnauthorizedException()
        }

        return { id: auth.userId, email: auth.email, role: auth.role }
    }
}

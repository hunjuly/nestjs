import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/services/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const auth = await this.authService.findOne({ email })

        const isCorrect = await this.authService.validate(auth.userId, password)

        if (!isCorrect) {
            throw new UnauthorizedException()
        }

        return { userId: auth.userId, email: auth.email }
    }
}

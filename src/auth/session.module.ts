import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { PassportSerializer } from '@nestjs/passport'
import * as session from 'express-session'
import * as passport from 'passport'

@Injectable()
class AuthSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: any) => void) {
        done(null, user)
    }

    deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
        done(null, payload)
    }
}

@Module({
    imports: [PassportModule.register({ session: true })],
    providers: [AuthSerializer]
})
export class SessionModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const option = {
            saveUninitialized: false,
            secret: ['sup3rs3cr3t', 'akjsdfhkladjsfh', 'sfdgkg321'],
            resave: false,
            name: 'connect.info',
            cookie: {
                sameSite: true,
                httpOnly: false,
                maxAge: 60 * 60 * 24
            },
            pauseStream: true
        }

        consumer.apply(session(option), passport.initialize(), passport.session()).forRoutes('*')
    }
}

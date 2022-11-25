import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as session from 'express-session'
import * as passport from 'passport'
import { AuthSerializer } from './auth-serializer'
import { AuthRecord } from './auth.record'
import { AuthsController } from './auths.controller'
import { AuthsService } from './auths.service'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [TypeOrmModule.forFeature([AuthRecord]), PassportModule.register({ session: true })],
    providers: [AuthsService, LocalStrategy, AuthSerializer],
    controllers: [AuthsController],
    exports: [AuthsService]
})
export class AuthsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // https://www.npmjs.com/package/express-session
        const option = {
            saveUninitialized: false,
            secret: ['sup3rs3cr3t', 'akjsdfhkladjsfh', 'sfdgkg321'],
            resave: false,
            name: 'connect.nestjs',
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

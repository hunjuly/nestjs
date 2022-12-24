import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { Authentication } from './domain'
import { AuthSerializer, LocalStrategy, SessionModule, UserGuard } from './etc'

@Module({
    imports: [
        TypeOrmModule.forFeature([Authentication]),
        PassportModule.register({ session: true }),
        SessionModule
    ],
    providers: [
        AuthService,
        AuthRepository,
        AuthSerializer,
        LocalStrategy,
        // useClass 대신에 useExisting을 사용하는 이유
        // e2e 테스트에서 UserGuard를 mocking한다. useExisting을 해야 클래스를 mock로 교체할 수 있다.
        // https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        UserGuard
    ],
    controllers: [AuthController],
    exports: [AuthService, LocalStrategy]
})
export class AuthModule {}

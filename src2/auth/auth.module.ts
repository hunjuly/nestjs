import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthRecord } from './auth.record'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { SessionModule } from './session.module'

@Module({
    imports: [TypeOrmModule.forFeature([AuthRecord]), SessionModule],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}

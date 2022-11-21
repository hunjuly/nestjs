import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthRecord } from './auth.record'
import { AuthsController } from './auths.controller'
import { AuthsService } from './auths.service'
import { LocalStrategy } from './local.strategy'
import { SessionModule } from './session.module'

@Module({
    imports: [TypeOrmModule.forFeature([AuthRecord]), SessionModule],
    providers: [AuthsService, LocalStrategy],
    controllers: [AuthsController],
    exports: [AuthsService]
})
export class AuthsModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthsModule } from 'src/auths'
import { UserRecord } from './records/user.record'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserRecord]), AuthsModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository]
})
export class UsersModule {}

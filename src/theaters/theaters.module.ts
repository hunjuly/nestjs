import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// import { UserRecord } from './records/user.record'
// import { UsersController } from './users.controller'
// import { UsersRepository } from './users.repository'
// import { UsersService } from './users.service'

@Module({
    // imports: [TypeOrmModule.forFeature([UserRecord])],
    // controllers: [UsersController],
    // providers: [UsersService, UsersRepository]
})
export class TheatersModule {}

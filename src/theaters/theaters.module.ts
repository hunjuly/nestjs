import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TheaterRecord } from './records/theater.record'
import { TheatersController } from './theaters.controller'
// import { TheatersRepository } from './theaters.repository'
import { TheatersService } from './theaters.service'

@Module({
    imports: [TypeOrmModule.forFeature([TheaterRecord])],
    controllers: [TheatersController],
    providers: [
        TheatersService
        // ,    TheatersRepository
    ]
})
export class TheatersModule {}

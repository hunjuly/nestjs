import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth'
import { CrudsController } from './cruds.controller'
import { CrudsRepository } from './cruds.repository'
import { CrudsService } from './cruds.service'
import { CrudRecord } from './records/crud.record'

@Module({
    imports: [TypeOrmModule.forFeature([CrudRecord]), AuthModule],
    controllers: [CrudsController],
    providers: [CrudsService, CrudsRepository]
})
export class CrudsModule {}

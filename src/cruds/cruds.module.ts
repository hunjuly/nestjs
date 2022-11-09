import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CrudsController } from './cruds.controller'
import { CrudsRepository } from './cruds.repository'
import { CrudsService } from './cruds.service'
import { CrudRecord } from './records/crud.record'

@Module({
    imports: [TypeOrmModule.forFeature([CrudRecord])],
    controllers: [CrudsController],
    providers: [CrudsService, CrudsRepository]
})
export class CrudsModule {}

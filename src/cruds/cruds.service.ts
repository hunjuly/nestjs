import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { BaseService } from 'src//common/application'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'
import { CrudRecord } from './records/crud.record'

@Injectable()
export class CrudsService extends BaseService<CrudRecord, Crud, CrudDto> {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {
        super(repository)
    }

    @OnEvent('crud.created')
    handleEvents(_crud: Crud) {}

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const crud = await Crud.create(this.repository, createDto)

        this.eventEmitter.emit('crud.created', crud)

        return this.entityToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        await crud.update(updateDto)

        return this.entityToDto(crud)
    }

    protected entityToDto(crud: Crud): CrudDto {
        return {
            id: crud.id,
            name: crud.name
        }
    }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { CrudsRepository } from './cruds.repository'
import { Crud, ICrudEventEmitter } from './domain'
import { CrudCreatedEvent, CrudUpdatedEvent, DomainEvent } from './domain/events'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

@Injectable()
export class CrudsService implements ICrudEventEmitter {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

    emitEvent(event: CrudCreatedEvent | CrudUpdatedEvent) {
        this.eventEmitter.emit(event.name, event)
    }

    @OnEvent('*.*')
    handleEvents(event: DomainEvent) {
        if (event instanceof CrudCreatedEvent) console.log('order.created', event)
        if (event instanceof CrudUpdatedEvent) console.log('order.updated', event)
    }

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const crud = await Crud.create(this.repository, createDto)

        this.emitEvent(new CrudCreatedEvent('abcd', {}))

        return crudToDto(crud)
    }

    async findAll(): Promise<CrudDto[]> {
        const cruds = await this.repository.findAll()

        return crudsToDtos(cruds)
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        return crudToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        await crud.update(updateDto)

        this.emitEvent(new CrudUpdatedEvent('abcd', {}))

        return crudToDto(crud)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }
}

function crudToDto(crud: Crud): CrudDto {
    return {
        id: crud.id,
        name: crud.name
    }
}

function crudsToDtos(cruds: Crud[]): CrudDto[] {
    const dtos: CrudDto[] = []

    cruds.forEach((crud) => {
        const dto = crudToDto(crud)
        dtos.push(dto)
    })

    return dtos
}

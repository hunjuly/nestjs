import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { CrudsRepository } from './cruds.repository'
import { Crud, ICrudEventEmitter } from './domain'
import { CrudCreatedEvent, CrudUpdatedEvent, DomainEvent } from './domain/events'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

@Injectable()
export class CrudsService implements ICrudEventEmitter {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const createCmd = { ...createDto }

        this.emitEvent(new CrudCreatedEvent('abcd', {}))

        const crud = await Crud.create(this.repository, createCmd)

        return crudToDto(crud)
    }

    emitEvent(event: CrudCreatedEvent | CrudUpdatedEvent) {
        this.eventEmitter.emit(event.name, event)
    }

    @OnEvent('*.*')
    handleEvents(event: DomainEvent) {
        if (event instanceof CrudCreatedEvent) console.log('order.created', event)
        if (event instanceof CrudUpdatedEvent) console.log('order.updated', event)
        // handle and process "OrderCreatedEvent" event
    }

    async findAll(): Promise<CrudDto[]> {
        const cruds = await this.repository.findAll()

        const dtos: CrudDto[] = []

        cruds.forEach((crud) => {
            const dto = crudToDto(crud)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await Crud.findById(this.repository, id)

        return crudToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const updateCmd = { ...updateDto }

        const crud = await Crud.update(this.repository, id, updateCmd)

        this.emitEvent(new CrudUpdatedEvent('abcd', {}))

        return crudToDto(crud)
    }

    async remove(id: string) {
        await Crud.remove(this.repository, id)

        return { id }
    }
}

function crudToDto(crud: Crud): CrudDto {
    return {
        id: crud.id,
        name: crud.name
    }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

@Injectable()
export class CrudsService {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

    // emitEvent(event: CrudCreatedEvent | CrudUpdatedEvent) {
    //     this.eventEmitter.emit(event.name, event)
    // }

    // @OnEvent('*.*')
    // handleEvents(event: DomainEvent) {
    //     if (event instanceof CrudCreatedEvent) console.log('order.created', event)
    //     if (event instanceof CrudUpdatedEvent) console.log('order.updated', event)
    // }

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const crud = await Crud.create(this.repository, createDto)

        // this.emitEvent(new CrudCreatedEvent('abcd', {}))

        return this.crudToDto(crud)
    }

    async findAll(): Promise<CrudDto[]> {
        const cruds = await this.repository.findAll()

        const dtos: CrudDto[] = []

        cruds.forEach((crud) => {
            const dto = this.crudToDto(crud)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        return this.crudToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        await crud.update(updateDto)

        // this.emitEvent(new CrudUpdatedEvent('abcd', {}))

        return this.crudToDto(crud)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }

    private crudToDto(crud: Crud): CrudDto {
        return {
            id: crud.id,
            name: crud.name
        }
    }
}

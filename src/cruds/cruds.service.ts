import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Pagination } from 'src/common'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

type PaginatedList<E> = { items: E[] }

@Injectable()
export class CrudsService {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

    private crudToDto(crud: Crud): CrudDto {
        return {
            id: crud.id,
            name: crud.name
        }
    }

    @OnEvent('crud.created')
    handleEvents(_crud: Crud) {
        // console.log(`a Crud(${_crud.name}) is created.`)
    }

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const crud = await Crud.create(this.repository, createDto)

        this.eventEmitter.emit('crud.created', crud)

        return this.crudToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        await crud.update(updateDto)

        return this.crudToDto(crud)
    }

    async findAll(page: Pagination): Promise<PaginatedList<CrudDto>> {
        const { entities, ...result } = await this.repository.findAll(page, {
            createDate: 'DESC'
        })

        const items: CrudDto[] = []

        entities.forEach((entity) => {
            const dto = this.crudToDto(entity)
            items.push(dto)
        })

        return { ...result, items }
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        return this.crudToDto(crud)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }
}

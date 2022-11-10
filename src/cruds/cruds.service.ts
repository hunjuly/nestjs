import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Pagination } from 'src/common'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

type CreateCrudUrl = (id: string) => string

@Injectable()
export class CrudsService {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

    private crudToDto(crud: Crud, crudUrl: (id: string) => string): CrudDto {
        return {
            id: crud.id,
            name: crud.name,
            url: crudUrl(crud.id)
        }
    }

    @OnEvent('crud.created')
    handleEvents(_crud: Crud) {
        // console.log(`a Crud(${_crud.name}) is created.`)
    }

    async create(createDto: CreateCrudDto, createUrl: CreateCrudUrl): Promise<CrudDto> {
        const crud = await Crud.create(this.repository, createDto)

        this.eventEmitter.emit('crud.created', crud)

        return this.crudToDto(crud, createUrl)
    }

    async update(id: string, updateDto: UpdateCrudDto, createUrl: CreateCrudUrl): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        await crud.update(updateDto)

        return this.crudToDto(crud, createUrl)
    }

    async findAll(page: Pagination, createUrl: CreateCrudUrl): Promise<CrudDto[]> {
        const result = await this.repository.findAll(page, {
            createDate: 'DESC'
        })

        const dtos: CrudDto[] = []

        result.entities.forEach((crud) => {
            const dto = this.crudToDto(crud, createUrl)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string, createUrl: CreateCrudUrl): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        return this.crudToDto(crud, createUrl)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }
}

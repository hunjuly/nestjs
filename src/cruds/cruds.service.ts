import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { FindOptionsOrderProperty } from 'typeorm'
import { BaseRecord, OrderOption, PageOption, PaginatedList } from 'src/common/service'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'
import { CrudRecord } from './records/crud.record'

// export declare type FindOptionsOrder<Entity> = {
//     [P in keyof Entity]?: P extends 'toString' ? unknown : 'ASC' | 'DESC' | 'asc' | 'desc'
// }

@Injectable()
export class CrudsService {
    constructor(private repository: CrudsRepository, private eventEmitter: EventEmitter2) {}

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

    async findAll(page: PageOption, order?: OrderOption): Promise<PaginatedList<CrudDto>> {
        let repositoryOrder = {}

        if (order) {
            if (this.repository.hasColumn(order.name)) {
                repositoryOrder = { [order.name]: order.direction }
            } else {
                throw new BadRequestException('unknown field name, ' + order.name)
            }
        }

        const { items, ...result } = await this.repository.findAll(page, repositoryOrder)

        const dtos: CrudDto[] = []

        items.forEach((item) => {
            const dto = this.entityToDto(item)
            dtos.push(dto)
        })

        return { ...result, items: dtos }
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await this.repository.findById(id)

        if (!crud) throw new NotFoundException()

        return this.entityToDto(crud)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }

    private entityToDto(crud: Crud): CrudDto {
        return {
            id: crud.id,
            name: crud.name
        }
    }

    @OnEvent('crud.created')
    handleEvents(_crud: Crud) {}
}

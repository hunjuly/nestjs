import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BaseRepository, OrderOption, PageOption, PaginatedResult } from 'src//common/application'

@Injectable()
export abstract class BaseService<Record, Entity, Dto> {
    constructor(private baseRepository: BaseRepository<Record, Entity>) {}

    async findAll(page: PageOption, order?: OrderOption): Promise<PaginatedResult<Dto>> {
        if (order && !this.baseRepository.hasColumn(order.name)) {
            throw new BadRequestException('unknown field name, ' + order.name)
        }

        const { items, ...result } = await this.baseRepository.findAll(page, order)

        const dtos: Dto[] = []

        items.forEach((item) => {
            const dto = this.entityToDto(item)
            dtos.push(dto)
        })

        return { ...result, items: dtos }
    }

    async findById(id: string): Promise<Dto> {
        const crud = await this.baseRepository.findById(id)

        if (!crud) throw new NotFoundException()

        return this.entityToDto(crud)
    }

    async remove(id: string) {
        const success = await this.baseRepository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }

    protected abstract entityToDto(crud: Entity): Dto
}

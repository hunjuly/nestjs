import { Repository } from 'typeorm'
import { Assert } from '../assert'
import { OrderOption, PageOption, PaginatedResult } from './pagination'

export abstract class BaseRepository<Record, Entity> {
    constructor(protected typeorm: Repository<any>) {}

    protected abstract recordToEntity(record: Record): Entity | null

    hasColumn(columnName: string) {
        for (const column of this.typeorm.metadata.columns) {
            if (column.databaseName === columnName) return true
        }

        return false
    }

    async findById(id: string): Promise<Entity | null> {
        const record = await this.typeorm.findOneBy({ id })

        return this.recordToEntity(record)
    }

    async create(dto: Partial<Entity>): Promise<Entity | null> {
        const record = await this.typeorm.save(dto)

        return this.recordToEntity(record)
    }

    async update(id: string, updateCrudDto: Partial<Record>): Promise<boolean> {
        const result = await this.typeorm.update(id, updateCrudDto)

        Assert.unique(result, 'The update id cannot be duplicated.')

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        Assert.unique(result, 'The remove id cannot be duplicated.')

        return result.affected === 1
    }

    async findAll(page: PageOption, order: OrderOption): Promise<PaginatedResult<Entity>> {
        const repositoryOrder = order ? { [order.name]: order.direction } : undefined

        const [records, total] = await this.typeorm.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: repositoryOrder
        })

        const cruds: Entity[] = []

        records.forEach((record) => {
            const crud = this.recordToEntity(record)
            cruds.push(crud)
        })

        return { ...page, total, items: cruds }
    }
}

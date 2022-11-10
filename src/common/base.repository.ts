import { FindOptionsOrder, Repository } from 'typeorm'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
import { Pagination } from './pagination'

export class BaseRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    createDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @VersionColumn()
    version: number
}

type PaginationResponse<T> = {
    limit: number
    offset: number
    total: number
    entities: T[]
}

export abstract class BaseRepository<Record, Entity> {
    constructor(protected typeorm: Repository<any>) {}

    protected abstract recordToEntity(record: Record): Entity | null

    async findById(id: string): Promise<Entity | null> {
        const record = await this.typeorm.findOneBy({ id })

        return this.recordToEntity(record)
    }

    async create(dto: Partial<Entity>): Promise<Entity | null> {
        const record = await this.typeorm.save(dto)

        return this.recordToEntity(record)
    }

    async findAll(page: Pagination, order: FindOptionsOrder<Record>): Promise<PaginationResponse<Entity>> {
        const [records, total] = await this.typeorm.findAndCount({
            skip: page.offset,
            take: page.limit,
            order
        })

        const cruds: Entity[] = []

        records.forEach((record) => {
            const crud = this.recordToEntity(record)
            cruds.push(crud)
        })

        return { ...page, total, entities: cruds }
    }

    async update(id: string, updateCrudDto: Partial<Record>): Promise<boolean> {
        const result = await this.typeorm.update(id, updateCrudDto)

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        return result.affected === 1
    }
}

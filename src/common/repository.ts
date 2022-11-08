import { Repository } from 'typeorm'
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

class BaseRecord {
    id: string
}

export abstract class BaseRepository<Record extends BaseRecord, Entity> {
    constructor(protected typeorm: Repository<BaseRecord>) {}

    protected abstract recordToCrud(record: Record): Entity | null

    async findById(id: string): Promise<Entity | null> {
        const record = await this.typeorm.findOneBy({ id })

        return this.recordToCrud(record)
    }

    async create(dto: CreateCrudDto): Promise<Crud | null> {
        const record = await this.typeorm.save(dto)

        return this.recordToCrud(record)
    }

    async findAll(): Promise<Crud[]> {
        const records = await this.typeorm.find()

        const cruds: Crud[] = []

        records.forEach((record) => {
            const crud = this.recordToCrud(record)
            cruds.push(crud)
        })

        return cruds
    }

    async update(id: string, updateCrudDto: Crud): Promise<boolean> {
        const result = await this.typeorm.update(id, updateCrudDto)

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        return result.affected === 1
    }
}

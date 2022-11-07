import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Crud, ICrudsRepository } from './domain'
import { CreateCrudDto, UpdateCrudDto } from './dto'
import { CrudRecord } from './records/crud.record'

@Injectable()
export class CrudsRepository implements ICrudsRepository {
    constructor(
        @InjectRepository(CrudRecord)
        private typeorm: Repository<CrudRecord>
    ) {}

    private recordToCrud(record: CrudRecord): Crud | null {
        if (!record) return null

        return new Crud(this, record.id, record.name)
    }

    async findById(id: string): Promise<Crud | null> {
        const record = await this.typeorm.findOneBy({ id })

        return this.recordToCrud(record)
    }

    async findByName(name: string): Promise<Crud | null> {
        const record = await this.typeorm.findOneBy({ name })

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

    async update(id: string, updateCrudDto: UpdateCrudDto): Promise<boolean> {
        const result = await this.typeorm.update(id, updateCrudDto)

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        return result.affected === 1
    }
}

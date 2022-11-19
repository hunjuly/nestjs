import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from 'src//common/application'
import { Crud, ICrudsRepository } from './domain'
import { CrudRecord } from './records/crud.record'

@Injectable()
export class CrudsRepository extends BaseRepository<CrudRecord, Crud> implements ICrudsRepository {
    constructor(@InjectRepository(CrudRecord) typeorm: Repository<CrudRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: CrudRecord): Crud | null {
        if (!record) return null

        return new Crud(this, record.id, record.name)
    }

    async findByName(name: string): Promise<Crud | null> {
        const record = await this.typeorm.findOneBy({ name })

        return this.recordToEntity(record)
    }
}

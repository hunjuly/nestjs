import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from 'src/common'
import { IUsersRepository, User } from './domain'
import { UserRecord } from './records/user.record'

@Injectable()
export class UsersRepository extends BaseRepository<UserRecord, User> implements IUsersRepository {
    constructor(@InjectRepository(UserRecord) typeorm: Repository<UserRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: UserRecord): User | null {
        if (!record) return null

        return new User(
            this,
            record.id,
            record.email,
            record.username,
            record.role,
            record.createDate,
            record.updateDate
        )
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.typeorm.findOneBy({ email })

        return this.recordToEntity(record)
    }
}

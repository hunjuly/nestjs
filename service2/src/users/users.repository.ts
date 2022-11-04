import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IUsersRepository, User } from './domain'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UserRecord } from './records/user.record'

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectRepository(UserRecord)
        private typeorm: Repository<UserRecord>
    ) {}

    async findById(id: string): Promise<User | null> {
        const record = await this.typeorm.findOneBy({ id })

        return recordToUser(record)
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.typeorm.findOneBy({ email })

        return recordToUser(record)
    }

    async create(dto: CreateUserDto): Promise<User | null> {
        const record = await this.typeorm.save(dto)

        return recordToUser(record)
    }

    async findAll(): Promise<User[]> {
        const records = await this.typeorm.find()

        const users: User[] = []

        records.forEach((record) => {
            const user = recordToUser(record)
            users.push(user)
        })

        return users
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
        const result = await this.typeorm.update(id, updateUserDto)

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        return result.affected === 1
    }
}

function recordToUser(record: UserRecord): User | null {
    if (!record) return null

    return {
        id: record.id,
        email: record.email,
        username: record.username,
        createDate: record.createDate,
        updateDate: record.updateDate
    }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pagination } from 'src/components'
import { IUsersRepository, UpdateUserDto, User, UserQuery } from './domain'

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectRepository(User)
        private typeorm: Repository<User>
    ) {}

    async get(userId: string) {
        return this.typeorm.findOneBy({ id: userId })
    }

    async findOne(where: UserQuery) {
        return this.typeorm.findOneBy(where)
    }

    async findAll(page: Pagination) {
        const [items, total] = await this.typeorm.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: {
                id: 'DESC'
            }
        })

        return { ...page, total, items }
    }

    async create(candidate: User) {
        const newUser = await this.typeorm.save(candidate)

        return newUser
    }

    async remove(userId: string) {
        const res = await this.typeorm.delete(userId)

        return res.affected === 1
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.typeorm.update(userId, dto)

        return res.affected === 1
    }
}

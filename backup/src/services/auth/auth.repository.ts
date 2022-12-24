import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthQuery, Authentication, IAuthRepository } from './domain'

@Injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectRepository(Authentication)
        private typeorm: Repository<Authentication>
    ) {}

    async create(auth: Authentication) {
        const newAuth = this.typeorm.save(auth)

        return newAuth
    }

    async remove(userId: string) {
        const res = await this.typeorm.delete(userId)

        return res.affected === 1
    }

    async get(userId: string) {
        const user = await this.typeorm.findOneBy({ userId })

        return user
    }

    async findOne(where: AuthQuery) {
        const auth = await this.typeorm.findOne({ where })

        return auth
    }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { SystemError } from 'src/common'
import { UserRole } from 'src/users/domain'
import { AuthRecord } from './auth.record'

export class CreateAuthDto {
    userId: string
    email: string
    role: UserRole
    password: string
}

@Injectable()
export class AuthsService {
    constructor(
        @InjectRepository(AuthRecord)
        private typeorm: Repository<AuthRecord>
    ) {}

    async create(dto: CreateAuthDto) {
        const user = await this.findByEmail(dto.email)

        if (user) throw new SystemError('already exists authentication')

        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hash = await bcrypt.hash(dto.password, saltOrRounds)

        const candidate = new AuthRecord()
        candidate.userId = dto.userId
        candidate.email = dto.email
        candidate.role = dto.role
        candidate.passwordHash = hash

        const newUser = await this.typeorm.save(candidate)

        return {
            email: newUser.email,
            userId: newUser.userId
        }
    }

    async remove(userId: string) {
        const res = await this.typeorm.delete(userId)

        return res.affected === 1
    }

    async validate(userId: string, password: string) {
        const auth = await this.typeorm.findOneBy({ userId })

        if (!auth) return false

        return bcrypt.compare(password, auth.passwordHash)
    }

    async findByUserId(userId: string): Promise<AuthRecord | null> {
        const auth = await this.typeorm.findOneBy({ userId })

        return auth
    }

    async findByEmail(email: string): Promise<AuthRecord | null> {
        const auth = await this.typeorm.findOneBy({ email })

        return auth
    }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src//common/application'
import { AuthsService } from 'src/auths'
import { User } from './domain'
import { CreateUserDto, UpdateUserDto, UserDto } from './dto'
import { UserRecord } from './records/user.record'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService extends BaseService<UserRecord, User, UserDto> {
    constructor(private repository: UsersRepository, private authService: AuthsService) {
        super(repository)
    }

    async create(createDto: CreateUserDto): Promise<UserDto> {
        const { password, ...createCmd } = createDto

        const user = await User.create(this.repository, createCmd)

        await this.authService.create({
            userId: user.id,
            email: user.email,
            role: user.role,
            password: password
        })

        return this.entityToDto(user)
    }

    async update(id: string, updateDto: UpdateUserDto): Promise<UserDto> {
        const user = await this.repository.findById(id)

        if (!user) throw new NotFoundException()

        await user.update(updateDto)

        return this.entityToDto(user)
    }

    async remove(id: string) {
        const res = await super.remove(id)

        const success = await this.authService.remove(id)

        if (!success) Logger.error(`remove failed(auths/${id})`)

        return res
    }

    protected entityToDto(user: User): UserDto {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            createDate: user.createDate,
            updateDate: user.updateDate
        }
    }
}

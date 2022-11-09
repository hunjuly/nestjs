import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthService } from 'src/auth'
import { User } from './domain'
import { CreateUserDto, UpdateUserDto, UserDto } from './dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private repository: UsersRepository, private authService: AuthService) {}

    private userToDto(user: User): UserDto {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            createDate: user.createDate,
            updateDate: user.updateDate
        }
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

        return this.userToDto(user)
    }

    async update(id: string, updateDto: UpdateUserDto): Promise<UserDto> {
        const user = await this.repository.findById(id)

        if (!user) throw new NotFoundException()

        await user.update(updateDto)

        return this.userToDto(user)
    }

    async findAll(): Promise<UserDto[]> {
        const users = await this.repository.findAll()

        const dtos: UserDto[] = []

        users.forEach((user) => {
            const dto = this.userToDto(user)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string): Promise<UserDto> {
        const user = await this.repository.findById(id)

        if (!user) throw new NotFoundException()

        return this.userToDto(user)
    }

    async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundException()

        return { id }
    }
}

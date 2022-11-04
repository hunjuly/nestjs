import { Injectable } from '@nestjs/common'
import { AuthService } from 'src/auth'
import { User } from './domain'
import { CreateUserDto, UpdateUserDto, UserDto } from './dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private repository: UsersRepository, private authService: AuthService) {
        User.repository = this.repository
    }

    async create(createDto: CreateUserDto): Promise<UserDto> {
        const createCmd = { ...createDto }

        const user = await User.create(createCmd)

        await this.authService.create({
            userId: user.id,
            email: user.email,
            password: createDto.password
        })

        return userToDto(user)
    }

    async findAll(): Promise<UserDto[]> {
        const users = await this.repository.findAll()

        const dtos: UserDto[] = []

        users.forEach((user) => {
            const dto = userToDto(user)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string): Promise<UserDto> {
        const user = await User.findById(id)

        return userToDto(user)
    }

    async update(id: string, updateDto: UpdateUserDto): Promise<UserDto> {
        const updateCmd = { ...updateDto }

        const user = await User.update(id, updateCmd)

        return userToDto(user)
    }

    async remove(id: string) {
        await User.remove(id)

        return { id }
    }
}

function userToDto(user: User): UserDto {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        createDate: user.createDate,
        updateDate: user.updateDate
    }
}

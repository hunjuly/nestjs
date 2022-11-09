import { PartialType } from '@nestjs/mapped-types'
import { IUsersRepository } from '../interfaces'
import { CreateUserDto } from './create-user.service'

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserService {
    constructor(private readonly repository: IUsersRepository) {}

    async exec(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        Expect.found(success)

        const user = await this.repository.get(userId)

        Assert.truthy(user, `${userId} get failed.`)

        return user
    }
}

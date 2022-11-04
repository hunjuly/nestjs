import { AlreadyExistsUserException, NotFoundUserException } from './exceptions'
import { CreateUserCmd, UpdateUserCmd } from './types'
import { IUsersRepository } from './users.repository.interface'

export class User {
    constructor(public readonly repository: IUsersRepository) {}

    static async create(cmd: CreateUserCmd): Promise<User> {
        const found = await this.repository.findByEmail(cmd.email)

        if (found) throw new AlreadyExistsUserException()

        const user = await this.repository.create(cmd)

        return user
    }

    static async findAll(repository: IUsersRepository): Promise<User[]> {
        return repository.findAll()
    }

    static async findById(repository: IUsersRepository, id: string): Promise<User> {
        const user = await repository.findById(id)

        if (!user) throw new NotFoundUserException()

        return user
    }

    static async update(repository: IUsersRepository, id: string, updateDto: UpdateUserCmd): Promise<User> {
        const found = await repository.findByEmail(updateDto.email)

        if (found) throw new AlreadyExistsUserException()

        const success = await repository.update(id, updateDto)

        if (!success) throw new NotFoundUserException()

        const user = await repository.findById(id)

        return user
    }

    static async remove(repository: IUsersRepository, id: string) {
        const success = await repository.remove(id)

        if (!success) throw new NotFoundUserException()

        return { id }
    }
}

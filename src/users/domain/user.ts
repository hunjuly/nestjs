import { AlreadyExistsUserException, NotFoundUserException } from './exceptions'
import { IUsersRepository } from './interfaces'
import { CreateUserCmd, UpdateUserCmd } from './types'

export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public username: string,
        public readonly createDate: Date,
        public readonly updateDate: Date
    ) {}

    static async create(repository: IUsersRepository, cmd: CreateUserCmd): Promise<User> {
        const found = await repository.findByEmail(cmd.email)

        if (found) throw new AlreadyExistsUserException()

        const user = await repository.create(cmd)

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

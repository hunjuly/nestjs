import { AlreadyExistsUserException, NotFoundUserException } from './exceptions'
import { CreateUserCmd, UpdateUserCmd } from './types'
import { IUsersRepository } from './users.repository.interface'

export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public username: string,
        public readonly createDate: Date,
        public readonly updateDate: Date
    ) {}

    static repository: IUsersRepository

    static async create(cmd: CreateUserCmd): Promise<User> {
        const found = await this.repository.findByEmail(cmd.email)

        if (found) throw new AlreadyExistsUserException()

        const user = await this.repository.create(cmd)

        return user
    }

    static async findAll(): Promise<User[]> {
        return this.repository.findAll()
    }

    static async findById(id: string): Promise<User> {
        const user = await this.repository.findById(id)

        if (!user) throw new NotFoundUserException()

        return user
    }

    static async update(id: string, updateDto: UpdateUserCmd): Promise<User> {
        const found = await this.repository.findByEmail(updateDto.email)

        if (found) throw new AlreadyExistsUserException()

        const success = await this.repository.update(id, updateDto)

        if (!success) throw new NotFoundUserException()

        const user = await this.repository.findById(id)

        return user
    }

    static async remove(id: string) {
        const success = await this.repository.remove(id)

        if (!success) throw new NotFoundUserException()

        return { id }
    }
}

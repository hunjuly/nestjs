import { AggregateRoot, AlreadyExistsDomainException } from 'src/common/domain'
import { IUsersRepository } from './interfaces'
import { CreateUserCmd, UpdateUserCmd, UserRole } from './types'

export class User extends AggregateRoot {
    constructor(
        private repository: IUsersRepository,
        id: string,
        public email: string,
        public username: string,
        public role: UserRole,
        public readonly createDate: Date,
        public readonly updateDate: Date
    ) {
        super(id)
    }

    static async create(repository: IUsersRepository, cmd: CreateUserCmd): Promise<User> {
        const found = await repository.findByEmail(cmd.email)

        if (found) throw new AlreadyExistsDomainException()

        const user = await repository.create(cmd)

        return user
    }

    async update(cmd: UpdateUserCmd): Promise<void> {
        if (cmd.email) {
            const found = await this.repository.findByEmail(cmd.email)

            if (found) throw new AlreadyExistsDomainException()

            this.email = cmd.email
        }

        if (cmd.role) this.role = cmd.role
        if (cmd.username) this.username = cmd.username

        await this.repository.update(this.id, cmd)
    }
}

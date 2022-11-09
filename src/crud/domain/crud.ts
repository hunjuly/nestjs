import { AggregateRoot, AlreadyExistsDomainException } from 'src/common/domain'
import { ICrudsRepository } from './interfaces'
import { CreateCrudCmd, UpdateCrudCmd } from './types'

export class Crud extends AggregateRoot {
    constructor(private repository: ICrudsRepository, id: string, public name: string) {
        super(id)
    }

    static async create(repository: ICrudsRepository, cmd: CreateCrudCmd): Promise<Crud> {
        const found = await repository.findByName(cmd.name)

        if (found) throw new AlreadyExistsDomainException()

        const crud = await repository.create(cmd)

        return crud
    }

    async update(cmd: UpdateCrudCmd): Promise<void> {
        if (cmd.name) {
            const found = await this.repository.findByName(cmd.name)

            if (found) throw new AlreadyExistsDomainException()

            this.name = cmd.name
        }

        await this.repository.update(this.id, cmd)
    }
}

import { AggregateRoot, AlreadyExistsDomainException } from 'src/common/domain'
import { CrudCreatedEvent, CrudUpdatedEvent } from './events'
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

    async update(updateDto: UpdateCrudCmd): Promise<void> {
        if (updateDto.name) {
            const found = await this.repository.findByName(updateDto.name)

            if (found) throw new AlreadyExistsDomainException()

            this.name = updateDto.name
        }
    }
}

export class CrudEventHandler {
    handleCrudCreated(event: CrudCreatedEvent) {
        console.log('handleCrudCreatedEvent', event.crudId)
    }

    handleCrudUpdated(event: CrudUpdatedEvent) {
        console.log('handleCrudUpdatedEvent', event.crudId)
    }
}

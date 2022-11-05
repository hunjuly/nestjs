import { CrudCreatedEvent, CrudUpdatedEvent } from './events'
import { AlreadyExistsCrudException, NotFoundCrudException } from './exceptions'
import { ICrudsRepository } from './interfaces'
import { CreateCrudCmd, UpdateCrudCmd } from './types'

export class Crud {
    constructor(
        public readonly id: string,
        public name: string,
        public readonly createDate: Date,
        public readonly updateDate: Date
    ) {}

    static async create(repository: ICrudsRepository, cmd: CreateCrudCmd): Promise<Crud> {
        const found = await repository.findByName(cmd.name)

        if (found) throw new AlreadyExistsCrudException()

        const crud = await repository.create(cmd)

        return crud
    }

    static async findAll(repository: ICrudsRepository): Promise<Crud[]> {
        return repository.findAll()
    }

    static async findById(repository: ICrudsRepository, id: string): Promise<Crud> {
        const crud = await repository.findById(id)

        if (!crud) throw new NotFoundCrudException()

        return crud
    }

    static async update(repository: ICrudsRepository, id: string, updateDto: UpdateCrudCmd): Promise<Crud> {
        const found = await repository.findByName(updateDto.name)

        if (found) throw new AlreadyExistsCrudException()

        const success = await repository.update(id, updateDto)

        if (!success) throw new NotFoundCrudException()

        const crud = await repository.findById(id)

        return crud
    }

    static async remove(repository: ICrudsRepository, id: string) {
        const success = await repository.remove(id)

        if (!success) throw new NotFoundCrudException()

        return { id }
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

import { Crud } from '../domain'
import { CreateCrudDto } from '../dto/create-crud.dto'
import { CrudDto } from '../dto/crud.dto'
import { UpdateCrudDto } from '../dto/update-crud.dto'

export const createDto = {
    name: 'crud name'
}

export const crudId = 'uuid#1'
export const name = 'crud@mail.com'

export const crud = { id: crudId, name } as Crud
export const cruds = [
    { id: 'uuid#1', name: 'crud1@test.com' },
    { id: 'uuid#2', name: 'crud2@test.com' }
] as Crud[]

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchCrudDto(expected): CustomMatcherResult
        }
    }
}

expect.extend({
    toMatchCrudDto(crud: CrudDto, dto: CreateCrudDto | UpdateCrudDto) {
        const expected = {
            id: crud.id,
            name: crud.name
        }

        const received = expect.objectContaining({
            id: expect.any(String),
            name: dto.name
        })

        const pass = this.equals(received, expected)

        return {
            pass,
            message: () =>
                `expected ${this.utils.printReceived(
                    expected
                )} not to contain object ${this.utils.printExpected(received)}`
        }
    }
})

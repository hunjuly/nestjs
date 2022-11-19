import { OrderOption } from 'src/common/service'
import { Crud } from '../domain'
import { CreateCrudDto } from '../dto/create-crud.dto'
import { CrudDto } from '../dto/crud.dto'
import { UpdateCrudDto } from '../dto/update-crud.dto'

export const createDto = { name: 'crud name' }
export const updateDto = { name: 'new name' }

export const firstDto = { name: 'first' }
export const secondDto = { name: 'second' }

export const dtos = [{ name: 'name1' }, { name: 'name2' }, { name: 'name3' }]

export const crudId = 'uuid#1'
export const name = 'crud@mail.com'

export const crud = { id: crudId, name } as Crud
export const cruds = [
    { id: 'uuid#1', name: 'crud1@test.com' },
    { id: 'uuid#2', name: 'crud2@test.com' },
    { id: 'uuid#3', name: 'crud3@test.com' }
] as Crud[]

export const pageOption = { offset: 0, limit: 10 }
export const pagedResult = { ...pageOption, total: 2, items: cruds }
export const orderOption = { name: 'createDate', direction: 'desc' } as OrderOption
export const updatedCrud = { ...crud, name: 'new name' }
export const removeResult = { id: crudId }

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

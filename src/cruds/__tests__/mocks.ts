import { CreateCrudDto } from '../dto/create-crud.dto'
import { CrudDto } from '../dto/crud.dto'
import { UpdateCrudDto } from '../dto/update-crud.dto'

export const createDto = {
    name: 'crud name'
}

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

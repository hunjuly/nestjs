import { CreateCrudDto } from '../dto/create-crud.dto'
import { CrudDto } from '../dto/crud.dto'
import { UpdateCrudDto } from '../dto/update-crud.dto'

export const createDto = {
    name: 'crud name'
}

export const dtos = [{ name: 'crudname1' }, { name: 'crudname2' }, { name: 'crudname3' }]

export const expectCrudDto = (crud: CrudDto, dto: CreateCrudDto | UpdateCrudDto) => {
    const received = {
        id: crud.id,
        name: crud.name
    }

    const expected = expect.objectContaining({
        id: expect.any(String),
        name: dto.name
    })

    expect(received).toEqual(expected)
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
    toMatchCrudDto(dto: CreateCrudDto | UpdateCrudDto, crud: CrudDto) {
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
                `expected ${this.utils.printReceived(dto)} not to contain object ${this.utils.printExpected(
                    crud
                )}`
        }

        // for (const expected of expectedList) {
        //     pass = this.equals(actual, expect.arrayContaining([expect.objectContaining(expected)]))

        //     if (!pass) break
        // }

        // return {
        //     pass,
        //     message: () =>
        //         `expected ${this.utils.printReceived(
        //             actual
        //         )} not to contain object ${this.utils.printExpected(expectedList)}`
        // }
    }
})

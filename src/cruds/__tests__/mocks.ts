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

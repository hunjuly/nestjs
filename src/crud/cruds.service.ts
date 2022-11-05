import { Injectable } from '@nestjs/common'
import { CrudsRepository } from './cruds.repository'
import { Crud } from './domain'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

@Injectable()
export class CrudsService {
    constructor(private repository: CrudsRepository) {}

    async create(createDto: CreateCrudDto): Promise<CrudDto> {
        const createCmd = { ...createDto }

        const crud = await Crud.create(this.repository, createCmd)

        return crudToDto(crud)
    }

    async findAll(): Promise<CrudDto[]> {
        const cruds = await this.repository.findAll()

        const dtos: CrudDto[] = []

        cruds.forEach((crud) => {
            const dto = crudToDto(crud)
            dtos.push(dto)
        })

        return dtos
    }

    async findById(id: string): Promise<CrudDto> {
        const crud = await Crud.findById(this.repository, id)

        return crudToDto(crud)
    }

    async update(id: string, updateDto: UpdateCrudDto): Promise<CrudDto> {
        const updateCmd = { ...updateDto }

        const crud = await Crud.update(this.repository, id, updateCmd)

        return crudToDto(crud)
    }

    async remove(id: string) {
        await Crud.remove(this.repository, id)

        return { id }
    }
}

function crudToDto(crud: Crud): CrudDto {
    return {
        id: crud.id,
        name: crud.name,
        createDate: crud.createDate,
        updateDate: crud.updateDate
    }
}

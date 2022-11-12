import { Test } from '@nestjs/testing'
import { createSpy } from 'src/common/jest'
import { GlobalModule } from 'src/global.module'
import { CrudsRepository } from '../cruds.repository'
import { CrudsService } from '../cruds.service'
import { Crud } from '../domain'

jest.mock('../cruds.repository')

describe('CrudsService', () => {
    let service: CrudsService
    let repository: CrudsRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule],
            providers: [CrudsService, CrudsRepository]
        }).compile()

        service = module.get(CrudsService)
        repository = module.get(CrudsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    const crudId = 'uuid#1'
    const name = 'crud@mail.com'

    const crud = { id: crudId, name } as Crud

    const cruds = [
        { id: 'uuid#1', name: 'crud1@test.com' },
        { id: 'uuid#2', name: 'crud2@test.com' }
    ] as Crud[]

    it('create a crud', async () => {
        const crudCandidate = { id: undefined, name } as Crud

        const spy = createSpy(repository, 'create', [crudCandidate], crud)

        const createCrudDto = { name }

        const recv = await service.create(createCrudDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('find all cruds ', async () => {
        const page = { offset: 0, limit: 10 }
        const pagedCruds = { ...page, total: 2, items: cruds }
        const options = {
            createDate: 'DESC'
        }
        const spy = createSpy(repository, 'findAll', [page, options], pagedCruds)

        const recv = await service.findAll(page)

        expect(spy).toHaveBeenCalled()
        expect(recv.items).toMatchArray(pagedCruds.items)
    })

    it('find a crud', async () => {
        const spy = createSpy(repository, 'findById', [crudId], crud)

        const recv = await service.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove a crud', async () => {
        createSpy(repository, 'findById', [crudId], crud)

        const spy = createSpy(repository, 'remove', [crudId], true)

        const recv = await service.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject({ id: crudId })
    })

    it('update a crud', async () => {})
})

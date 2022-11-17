import { createModule, createSpy } from 'src/common/jest'
import { CrudsRepository } from '../cruds.repository'
import { CrudsService } from '../cruds.service'
import { Crud } from '../domain'
import { crud, crudId, cruds, name } from './mocks'

jest.mock('../cruds.repository')

describe('CrudsService', () => {
    let service: CrudsService
    let repository: CrudsRepository

    beforeEach(async () => {
        const module = await createModule([], [CrudsService, CrudsRepository])

        service = module.get(CrudsService)
        repository = module.get(CrudsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

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
            createDatea: 'DESC'
        }
        const spy = createSpy(repository, 'findAll', [page, options], pagedCruds)
        createSpy(repository, 'hasColumn', ['createDate'], true)

        const recv = await service.findAll(page, {
            name: 'createDate',
            direction: 'DESC'
        })

        expect(spy).toHaveBeenCalled()
        expect(recv.items).toMatchObject(pagedCruds.items)
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

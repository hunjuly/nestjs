import { createModule, createSpy } from 'src/common/jest'
import { CrudsRepository } from '../cruds.repository'
import { CrudsService } from '../cruds.service'
import { createDto, crud, crudId, orderOption, pageOption, pagedResult } from './mocks'

jest.mock('../cruds.repository')

describe('CrudsService', () => {
    let service: CrudsService
    let repository: CrudsRepository

    beforeEach(async () => {
        const module = await createModule({
            providers: [CrudsService, CrudsRepository]
        })

        service = module.get(CrudsService)
        repository = module.get(CrudsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create', async () => {
        const spy = createSpy(repository, 'create', [createDto], crud)

        const recv = await service.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('findAll', async () => {
        const ___ = createSpy(repository, 'hasColumn', undefined, true)
        const spy = createSpy(repository, 'findAll', [pageOption, orderOption], pagedResult)

        const recv = await service.findAll(pageOption, orderOption)

        expect(spy).toHaveBeenCalled()
        expect(recv.items).toMatchObject(pagedResult.items)
    })

    it('findById', async () => {
        const spy = createSpy(repository, 'findById', [crudId], crud)

        const recv = await service.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove', async () => {
        const ___ = createSpy(repository, 'findById', [crudId], crud)
        const spy = createSpy(repository, 'remove', [crudId], true)

        const recv = await service.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject({ id: crudId })
    })

    it('update a crud', async () => {})
})

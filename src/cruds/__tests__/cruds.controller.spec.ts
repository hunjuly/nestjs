import 'jest'
import { createModule, createSpy } from 'src/common/jest'
import { CrudsController } from '../cruds.controller'
import { CrudsService } from '../cruds.service'
import { crud, crudId, cruds, name, updateDto, updatedCrud } from './mocks'

jest.mock('../cruds.service')

describe('CrudsController', () => {
    let controller: CrudsController
    let service: CrudsService

    beforeEach(async () => {
        const module = await createModule({
            controllers: [CrudsController],
            providers: [CrudsService]
        })

        controller = module.get(CrudsController)
        service = module.get(CrudsService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('create', async () => {
        const createDto = { name }

        const spy = createSpy(service, 'create', [createDto], crud)

        const recv = await controller.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('findAll', async () => {
        const page = { offset: 0, limit: 10 }
        const pagedCruds = { ...page, total: 2, items: cruds }

        const spy = createSpy(service, 'findAll', [page], pagedCruds)

        const items = await controller.findAll(page)

        expect(spy).toHaveBeenCalled()
        expect(items.items).toMatchObject(pagedCruds.items)
    })

    it('findOne', async () => {
        const spy = createSpy(service, 'findById', [crudId], crud)

        const recv = await controller.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove', async () => {
        const removeResult = { id: crudId }

        const spy = createSpy(service, 'remove', [crudId], removeResult)

        const recv = await controller.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(removeResult)
    })

    it('update', async () => {
        const spy = createSpy(service, 'update', [crudId, updateDto], updatedCrud)

        const recv = await controller.update(crudId, updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(updatedCrud)
    })
})

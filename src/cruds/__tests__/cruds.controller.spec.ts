import 'jest'
import { createSpy, createTestingModule } from 'src/common/jest'
import { CrudsController } from '../cruds.controller'
import { CrudsService } from '../cruds.service'
import {
    createDto,
    crud,
    crudId,
    pageOption,
    pagedResult,
    removeResult,
    updateDto,
    updatedCrud
} from './mocks'

jest.mock('../cruds.service')

describe('CrudsController', () => {
    let controller: CrudsController
    let service: CrudsService

    beforeEach(async () => {
        const module = await createTestingModule({
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
        const spy = createSpy(service, 'create', [createDto], crud)

        const recv = await controller.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('findAll', async () => {
        const spy = createSpy(service, 'findAll', [pageOption], pagedResult)

        const result = await controller.findAll(pageOption)

        expect(spy).toHaveBeenCalled()
        expect(result.items).toMatchObject(pagedResult.items)
    })

    it('findById', async () => {
        const spy = createSpy(service, 'findById', [crudId], crud)

        const recv = await controller.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove', async () => {
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

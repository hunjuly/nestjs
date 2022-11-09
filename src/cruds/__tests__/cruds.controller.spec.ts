import { Test } from '@nestjs/testing'
import 'jest'
import { createSpy } from 'src/common'
import { CrudsController } from '../cruds.controller'
import { CrudsService } from '../cruds.service'
import { Crud } from '../domain'

jest.mock('../cruds.service')

describe('CrudsController', () => {
    let controller: CrudsController
    let service: CrudsService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [CrudsController],
            providers: [CrudsService]
        }).compile()

        controller = module.get(CrudsController)
        service = module.get(CrudsService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    const crudId = 'uuid#1'
    const name = 'crud@mail.com'
    const password = 'pass#001'

    const crud = { id: crudId, name } as Crud

    const cruds = [
        { id: 'uuid#1', name: 'crud1@test.com' },
        { id: 'uuid#2', name: 'crud2@test.com' }
    ] as Crud[]

    it('create', async () => {
        const createDto = { name, password }

        const spy = createSpy(service, 'create', [createDto], crud)

        const recv = await controller.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
        expect(recv).toHaveProperty('url')
    })

    it('findAll', async () => {
        const page = { offset: 0, limit: 10 }
        const pagedCruds = { ...page, total: 2, items: cruds }

        const spy = createSpy(service, 'findAll', [page], pagedCruds)

        const items = await controller.findAll()

        expect(spy).toHaveBeenCalled()
        expect(items).toMatchArray(pagedCruds.items)
        expect(items[0]).toHaveProperty('url')
    })

    it('findOne', async () => {
        const spy = createSpy(service, 'get', [crudId], crud)

        const recv = await controller.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
        expect(recv).toHaveProperty('url')
    })

    it('remove', async () => {
        const removeResult = { id: crudId }

        const spy = createSpy(service, 'remove', [crudId], removeResult)

        const recv = await controller.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(removeResult)
    })

    it('update', async () => {
        const updateDto = { name: 'old name' }
        const updatedCrud = { ...crud, name: 'new name' }

        const spy = createSpy(service, 'update', [crudId, updateDto], updatedCrud)

        const recv = await controller.update(crudId, updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(updatedCrud)
    })
})

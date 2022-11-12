import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createSpy, createTypeOrmMock } from 'src/common/jest'
import { CrudsRepository } from '../cruds.repository'
import { Crud } from '../domain'
import { CrudRecord } from '../records/crud.record'

describe('CrudsRepository', () => {
    let repository: CrudsRepository
    let typeorm: Repository<CrudRecord>

    beforeEach(async () => {
        const repositoryToken = getRepositoryToken(CrudRecord)

        const module = await Test.createTestingModule({
            providers: [
                CrudsRepository,
                {
                    provide: repositoryToken,
                    useValue: createTypeOrmMock()
                }
            ]
        }).compile()

        repository = module.get(CrudsRepository)
        typeorm = module.get(repositoryToken)
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    const crudId = 'uuid#1'
    const name = 'crud@mail.com'

    const crud = { id: crudId, name } as Crud

    const cruds = [
        { id: 'uuid#1', name: 'crud1@test.com' },
        { id: 'uuid#2', name: 'crud2@test.com' }
    ] as Crud[]

    it('create', async () => {
        const crudCandidate = { id: undefined, name } as Crud

        const spy = createSpy(typeorm, 'save', [crudCandidate], crud)

        const recv = await repository.create(crudCandidate)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('findAll', async () => {
        const page = { offset: 0, limit: 10 }

        const spy = createSpy(
            typeorm,
            'findAndCount',
            [{ skip: 0, take: 10, order: { createDate: 'DESC' } }],
            [cruds, 4]
        )

        const recv = await repository.findAll(page, { createDate: 'DESC' })

        expect(spy).toHaveBeenCalled()
        expect(recv.total).toEqual(4)
        expect(recv.items).toMatchObject(cruds)
    })

    it('get', async () => {
        const spy = createSpy(typeorm, 'findOneBy', [{ id: crudId }], crud)

        const recv = await repository.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove', async () => {
        const spy = createSpy(typeorm, 'delete', [crudId], { affected: 1 })

        const recv = await repository.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })

    it('update', async () => {
        const updateDto = { name: 'newpass' }

        const spy = createSpy(typeorm, 'update', [crudId, updateDto], { affected: 1 })

        const recv = await repository.update(crudId, updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })
})

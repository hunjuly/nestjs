import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createModule, createSpy, createTypeOrmMock } from 'src/common/jest'
import { CrudsRepository } from '../cruds.repository'
import { Crud } from '../domain'
import { CrudRecord } from '../records/crud.record'
import { createDto, crud, crudId, cruds } from './mocks'

describe('CrudsRepository', () => {
    let repository: CrudsRepository
    let typeorm: Repository<CrudRecord>

    beforeEach(async () => {
        const repositoryToken = getRepositoryToken(CrudRecord)

        const module = await createModule({
            providers: [
                CrudsRepository,
                {
                    provide: repositoryToken,
                    useValue: createTypeOrmMock()
                }
            ]
        })

        repository = module.get(CrudsRepository)
        typeorm = module.get(repositoryToken)
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    it('create', async () => {
        const spy = createSpy(typeorm, 'save', [createDto], crud)

        const recv = await repository.create(createDto)

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

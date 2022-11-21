import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createSpy, createTestingModule, createTypeOrmMock } from 'src/common/jest'
import { CrudsRepository } from '../cruds.repository'
import { CrudRecord } from '../records/crud.record'
import { createDto, crud, crudId, cruds, orderOption, pageOption, updateDto } from './mocks'

describe('CrudsRepository', () => {
    let repository: CrudsRepository
    let typeorm: Repository<CrudRecord>

    beforeEach(async () => {
        const typeormProvider = {
            provide: getRepositoryToken(CrudRecord),
            useValue: createTypeOrmMock()
        }

        const module = await createTestingModule({
            providers: [CrudsRepository, typeormProvider]
        })

        repository = module.get(CrudsRepository)
        typeorm = module.get(typeormProvider.provide)
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    it('create', async () => {
        const spy = createSpy(typeorm, 'save', undefined, crud)

        const recv = await repository.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('findAll', async () => {
        const spy = createSpy(typeorm, 'findAndCount', undefined, [cruds, cruds.length])

        const recv = await repository.findAll(pageOption, orderOption)

        expect(spy).toHaveBeenCalled()
        expect(recv.total).toEqual(cruds.length)
        expect(recv.items).toMatchObject(cruds)
    })

    it('findById', async () => {
        const spy = createSpy(typeorm, 'findOneBy', undefined, crud)

        const recv = await repository.findById(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(crud)
    })

    it('remove', async () => {
        const spy = createSpy(typeorm, 'delete', undefined, { affected: 1 })

        const recv = await repository.remove(crudId)

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })

    it('update', async () => {
        const spy = createSpy(typeorm, 'update', undefined, { affected: 1 })

        const recv = await repository.update(crudId, updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })
})

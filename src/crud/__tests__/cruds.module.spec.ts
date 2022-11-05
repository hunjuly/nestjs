import { CanActivate, ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, UserGuard } from 'src/auth'
import { createMemoryOrm } from 'src/common'
import { CrudsModule } from '../cruds.module'
import { CrudsService } from '../cruds.service'
import { CreateCrudDto } from '../dto/create-crud.dto'
import { CrudDto } from '../dto/crud.dto'
import { UpdateCrudDto } from '../dto/update-crud.dto'

class MockAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}

describe('/cruds', () => {
    let app: INestApplication
    let service: CrudsService

    const createDto = {
        name: 'crud name'
    }

    const request = () => supertest(app.getHttpServer())
    const createCrud = (dto: CreateCrudDto) => request().post('/cruds').send(dto)
    const findAllCruds = () => request().get('/cruds')
    const findCrud = (crudId: string) => request().get('/cruds/' + crudId)
    const deleteCrud = (crudId: string) => request().delete('/cruds/' + crudId)

    const updateCrud = (crudId: string, dto: UpdateCrudDto) =>
        request()
            .patch('/cruds/' + crudId)
            .send(dto)

    const expectCrudDto = (crud: CrudDto, dto: CreateCrudDto | UpdateCrudDto) => {
        const received = {
            id: crud.id,
            name: crud.name,
            createDate: new Date(crud.createDate),
            updateDate: new Date(crud.updateDate)
        }

        const expected = expect.objectContaining({
            id: expect.any(String),
            name: dto.name,
            createDate: expect.any(Date),
            updateDate: expect.any(Date)
        })

        expect(received).toEqual(expected)
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CrudsModule, createMemoryOrm()]
        })
            .overrideGuard(UserGuard)
            .useClass(MockAuthGuard)
            .overrideGuard(AdminGuard)
            .useClass(MockAuthGuard)
            .compile()

        app = module.createNestApplication()
        await app.init()

        service = module.get(CrudsService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(app).toBeDefined()
        expect(service).toBeDefined()
    })

    it('/ (POST), create a crud', async () => {
        const create = await createCrud(createDto)

        expect(create.status).toEqual(HttpStatus.CREATED)
        expectCrudDto(create.body, createDto)
    })

    it('create a crud, but already exists email', async () => {
        const success = await createCrud(createDto)
        expect(success.status).toEqual(HttpStatus.CREATED)

        const fail = await createCrud(createDto)
        expect(fail.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/ (GET), find all cruds', async () => {
        // create cruds
        await createCrud({ name: 'crudname1' })
        await createCrud({ name: 'crudname2' })
        await createCrud({ name: 'crudname3' })

        // find all
        const find = await findAllCruds()
        const cruds = find.body

        // verify
        expect(find.status).toEqual(HttpStatus.OK)
        expect(cruds.length).toEqual(3)
        expect(cruds[0].name).toEqual('crudname1')
        expect(cruds[1].name).toEqual('crudname2')
        expect(cruds[2].name).toEqual('crudname3')
    })

    it('/:crudId (GET), find a crud', async () => {
        // create a crud
        const { body } = await createCrud(createDto)

        // find the crud
        const find = await findCrud(body.id)

        // verify
        expect(find.status).toEqual(HttpStatus.OK)
        expectCrudDto(find.body, createDto)
    })

    it('find a crud, but not found', async () => {
        const find = await findCrud('unknown-id')

        expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('/:crudId (PATCH), udpate a crud', async () => {
        // create
        const create = await createCrud(createDto)
        const crud = create.body

        // update the crud
        const updateDto = { name: 'new name' }
        const update = await updateCrud(crud.id, updateDto)
        expect(update.status).toEqual(HttpStatus.OK)
        expectCrudDto(update.body, updateDto)

        // find the crud
        const find = await findCrud(crud.id)
        expect(find.body).toMatchObject(updateDto)
    })

    it('udpate a crud, but not found', async () => {
        const update = await updateCrud('unknown-id', {})

        expect(update.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('udpate a crud, but already exists', async () => {
        // create A
        const createA = await createCrud({ name: 'crudA' })
        const crudA = createA.body

        // create B@mail.com
        await createCrud({ name: 'crudB' })

        // update A, but already exists email
        const res = await updateCrud(crudA.id, { name: 'crudB' })

        expect(res.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/:crudId (DELETE), remove a crud', async () => {
        // create a crud
        const create = await createCrud(createDto)
        const crud = create.body

        // delete the crud
        const delete_ = await deleteCrud(crud.id)
        expect(delete_.status).toEqual(HttpStatus.OK)
        expect(delete_.body).toEqual({ id: crud.id })

        // find the deleted crud
        const find = await findCrud(crud.id)
        expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('remove a crud, but not found', async () => {
        const delete_ = await deleteCrud('unknown-id')

        expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
    })
})

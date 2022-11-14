import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createModule, createRequest } from 'src/common/jest'
import { CrudsModule } from '../cruds.module'
import { CrudsService } from '../cruds.service'
import { createDto } from './mocks'

describe('/cruds', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: CrudsService

    beforeEach(async () => {
        module = await createModule([CrudsModule])
        app = await createApp(module)
        req = createRequest(app, '/cruds')

        service = module.get(CrudsService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(module).toBeDefined()
        expect(service).toBeDefined()
    })

    it('/ (POST), create a crud', async () => {
        const res = await req.post(createDto)

        expect(res.status).toEqual(HttpStatus.CREATED)
        expect(res.body).toMatchCrudDto(createDto)
    })

    it('create a crud, but already exists email', async () => {
        const first = await req.post(createDto)
        const second = await req.post(createDto)

        expect(first.status).toEqual(HttpStatus.CREATED)
        expect(second.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/:crudId (GET), find a crud', async () => {
        const createRes = await req.post(createDto)
        const findRes = await req.get(createRes.body.id)

        expect(findRes.status).toEqual(HttpStatus.OK)
        expect(findRes.body).toMatchCrudDto(createDto)
    })

    it('find a crud, but not found', async () => {
        const res = await req.get('unknown-id')

        expect(res.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('/:crudId (PATCH), udpate a crud', async () => {
        // create
        const createRes = await req.post(createDto)
        const crudId = createRes.body.id
        const updateDto = { name: 'new name' }

        // update the crud
        const updateRes = await req.patch(crudId, updateDto)
        // find the crud
        const findRes = await req.get(crudId)

        expect(updateRes.status).toEqual(HttpStatus.OK)
        expect(updateRes.body).toMatchCrudDto(updateDto)
        expect(findRes.body).toMatchCrudDto(updateDto)
    })

    it('udpate a crud, but not found', async () => {
        const updateRes = await req.patch('unknown-id', {})

        expect(updateRes.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('udpate a crud, but already exists', async () => {
        // create A
        const createA = await req.post({ name: 'crudA' })
        const crudA = createA.body

        // create B@mail.com
        await req.post({ name: 'crudB' })

        // update A, but already exists email
        const res = await req.patch(crudA.id, { name: 'crudB' })
        expect(res.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/:crudId (DELETE), remove a crud', async () => {
        // create a crud
        const { body } = await req.post(createDto)
        const crud = body

        // delete the crud
        const deleteRes = await req.delete(crud.id)
        expect(deleteRes.status).toEqual(HttpStatus.OK)
        expect(deleteRes.body).toEqual({ id: crud.id })

        // find the deleted crud
        const findRes = await req.get(crud.id)
        expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('remove a crud, but not found', async () => {
        const delete_ = await req.delete('unknown-id')

        expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
    })

    describe('/ (GET), find all cruds', () => {
        beforeEach(async () => {
            await req.post({ name: 'name1' })
            await req.post({ name: 'name2' })
            await req.post({ name: 'name3' })
        })

        it('defaut option', async () => {
            const res = await req.get()
            const cruds = res.body

            // verify
            expect(res.status).toEqual(HttpStatus.OK)
            expect(cruds.items.length).toEqual(3)
            expect(cruds.items[0].name).toEqual('name1')
            expect(cruds.items[1].name).toEqual('name2')
            expect(cruds.items[2].name).toEqual('name3')
        })

        it('pagination', async () => {
            const find = await req.get('?limit=5&offset=1')
            const cruds = find.body

            // verify
            expect(find.status).toEqual(HttpStatus.OK)
            expect(cruds.items.length).toEqual(2)
            expect(cruds.items[0].name).toEqual('name2')
            expect(cruds.items[1].name).toEqual('name3')
        })

        it('sort by name', async () => {
            // find all
            const find = await req.get('?orderby=name:desc')
            const cruds = find.body

            // verify
            expect(find.status).toEqual(HttpStatus.OK)
            expect(cruds.items.length).toEqual(3)
            expect(cruds.items[0].name).toEqual('name2')
            expect(cruds.items[1].name).toEqual('name1')
            expect(cruds.items[1].name).toEqual('name0')
        })
    })
})

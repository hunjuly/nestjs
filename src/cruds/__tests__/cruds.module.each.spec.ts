import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest, createTestingModule } from 'src/common/jest'
import { CrudsModule } from '../cruds.module'
import { CrudsService } from '../cruds.service'
import { createDto, createDtos, firstDto, secondDto, updateDto } from './mocks'

/*
Unit tests should not depend on other test cases.
So here, beforeEach is executed and the create user required for each test is executed.
However, this makes the code more complex.
It's good to test basic CRUD in order.
Below is a bad case.
*/
describe('/cruds', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: CrudsService

    beforeEach(async () => {
        module = await createTestingModule({
            modules: [CrudsModule]
        })
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

    describe('/ (POST)', () => {
        it('create a crud', async () => {
            const res = await req.post(createDto)

            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchCrudDto(createDto)
        })

        it('already exists resource', async () => {
            const first = await req.post(createDto)
            expect(first.status).toEqual(HttpStatus.CREATED)

            const second = await req.post(createDto)
            expect(second.status).toEqual(HttpStatus.CONFLICT)
        })
    })

    describe('/:crudId (GET)', () => {
        it('find a crud', async () => {
            const createRes = await req.post(createDto)
            const findRes = await req.get(createRes.body.id)

            expect(findRes.status).toEqual(HttpStatus.OK)
            expect(findRes.body).toMatchCrudDto(createDto)
        })

        it('resource not found', async () => {
            const res = await req.get('unknown-id')

            expect(res.status).toEqual(HttpStatus.NOT_FOUND)
        })
    })

    describe('/:crudId (PATCH)', () => {
        it('udpate a crud', async () => {
            // create
            const createRes = await req.post(createDto)
            const crudId = createRes.body.id

            // update
            const updateRes = await req.patch(crudId, updateDto)
            expect(updateRes.status).toEqual(HttpStatus.OK)
            expect(updateRes.body).toMatchCrudDto(updateDto)

            // find the updated crud.
            const findRes = await req.get(crudId)
            expect(findRes.body).toMatchCrudDto(updateDto)
        })

        it('resource not found', async () => {
            const updateRes = await req.patch('unknown-id', {})

            expect(updateRes.status).toEqual(HttpStatus.NOT_FOUND)
        })

        it('already exists resource', async () => {
            const _firstRes = await req.post(firstDto)
            const secondRes = await req.post(secondDto)
            const secondId = secondRes.body.id

            // update second to first
            const updateRes = await req.patch(secondId, {
                name: firstDto.name
            })

            expect(updateRes.status).toEqual(HttpStatus.CONFLICT)
        })
    })

    describe('/:crudId (DELETE)', () => {
        it('remove a crud', async () => {
            const createRes = await req.post(createDto)
            const crudId = createRes.body.id

            const deleteRes = await req.delete(crudId)
            expect(deleteRes.status).toEqual(HttpStatus.OK)
            expect(deleteRes.body).toEqual({ id: crudId })

            const findRes = await req.get(crudId)
            expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
        })

        it('resource not found', async () => {
            const delete_ = await req.delete('unknown-id')

            expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
        })
    })

    describe('/ (GET)', () => {
        beforeEach(async () => {
            await req.post(createDtos[0])
            await req.post(createDtos[1])
            await req.post(createDtos[2])
        })

        it('find all cruds', async () => {
            const res = await req.get()
            const cruds = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(cruds.length).toEqual(3)
            expect(cruds[0].name).toEqual(createDtos[0].name)
            expect(cruds[1].name).toEqual(createDtos[1].name)
            expect(cruds[2].name).toEqual(createDtos[2].name)
        })

        it('pagination', async () => {
            const res = await req.get('?limit=5&offset=1')
            const cruds = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(res.body.offset).toEqual(1)
            expect(res.body.total).toEqual(3)
            expect(cruds.length).toEqual(2)
            expect(cruds[0].name).toEqual(createDtos[1].name)
            expect(cruds[1].name).toEqual(createDtos[2].name)
        })

        it('order by name:desc', async () => {
            const res = await req.get('?orderby=name:desc')
            const cruds = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(cruds.length).toEqual(3)
            expect(cruds[0].name).toEqual(createDtos[2].name)
            expect(cruds[1].name).toEqual(createDtos[1].name)
            expect(cruds[2].name).toEqual(createDtos[0].name)
        })

        it('order by wrong column name', async () => {
            const res = await req.get('?orderby=wrong:desc')

            expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
        })
    })
})

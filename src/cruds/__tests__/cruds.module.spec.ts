import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestRequest, createModule } from 'src/common/jest'
import { CrudsModule } from '../cruds.module'
import { CrudsService } from '../cruds.service'
import { createDto, dtos, expectCrudDto } from './mocks'

describe('/cruds', () => {
    let service: CrudsService
    let req: TestRequest
    let closeApp: () => Promise<void>

    beforeEach(async () => {
        const { module, close, request } = await createModule([CrudsModule])

        service = module.get(CrudsService)
        req = request
        closeApp = close
    })

    afterEach(async () => {
        await closeApp()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('/ (POST), create a crud', async () => {
        const res = await req.post('/cruds', createDto)

        expect(res.status).toEqual(HttpStatus.CREATED)
        expectCrudDto(res.body, createDto)
    })

    it('create a crud, but already exists email', async () => {
        const first = await req.post('/cruds', createDto)
        expect(first.status).toEqual(HttpStatus.CREATED)

        const second = await req.post('/cruds', createDto)
        expect(second.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/ (GET), find all cruds', async () => {
        // create cruds
        for (const dto of dtos) {
            await req.post('/cruds', dto)
        }

        // find all
        const find = await req.get('/cruds?limit=5&offset=1&orderBy=createDate:desc')
        const cruds = find.body

        // verify
        expect(find.status).toEqual(HttpStatus.OK)
        expect(cruds.items.length).toEqual(2)
        expect(cruds.items[0].name).toEqual('crudname2')
        expect(cruds.items[1].name).toEqual('crudname3')
    })

    it('/:crudId (GET), find a crud', async () => {
        // create a crud
        const { body } = await req.post('/cruds', createDto)

        // find the crud
        const res = await req.get('/cruds/' + body.id)

        // verify
        expect(res.status).toEqual(HttpStatus.OK)
        expectCrudDto(res.body, createDto)
    })

    it('find a crud, but not found', async () => {
        const res = await req.get('/cruds/unknown-id')

        expect(res.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('/:crudId (PATCH), udpate a crud', async () => {
        // create
        const { body } = await req.post('/cruds', createDto)
        const crud = body

        const updateDto = { name: 'new name' }

        // update the crud
        const updateRes = await req.patch('/cruds/' + crud.id, updateDto)
        expect(updateRes.status).toEqual(HttpStatus.OK)

        expectCrudDto(updateRes.body, updateDto)

        // find the crud
        const findRes = await req.get('/cruds/' + crud.id)
        expect(findRes.body).toMatchObject(updateDto)
    })

    it('udpate a crud, but not found', async () => {
        const updateRes = await req.patch('/cruds/unknown-id', {})

        expect(updateRes.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('udpate a crud, but already exists', async () => {
        // create A
        const createA = await req.post('/cruds', { name: 'crudA' })
        const crudA = createA.body

        // create B@mail.com
        await req.post('/cruds', { name: 'crudB' })

        // update A, but already exists email
        const res = await req.patch('/cruds/' + crudA.id, { name: 'crudB' })
        expect(res.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/:crudId (DELETE), remove a crud', async () => {
        // create a crud
        const { body } = await req.post('/cruds', createDto)
        const crud = body

        // delete the crud
        const deleteRes = await req.delete('/cruds/' + crud.id)
        expect(deleteRes.status).toEqual(HttpStatus.OK)
        expect(deleteRes.body).toEqual({ id: crud.id })

        // find the deleted crud
        const findRes = await req.get('/cruds/' + crud.id)
        expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('remove a crud, but not found', async () => {
        const delete_ = await req.delete('/cruds/unknown-id')

        expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
    })
})

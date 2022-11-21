import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest, createTestingModule } from 'src/common/jest'
import { UsersModule } from '../users.module'
import { UsersService } from '../users.service'
import { createDto, createDtos, firstDto, secondDto, updateDto } from './mocks'

describe('/users', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: UsersService

    beforeEach(async () => {
        module = await createTestingModule({
            modules: [UsersModule]
        })
        app = await createApp(module)
        req = createRequest(app, '/users')

        service = module.get(UsersService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(module).toBeDefined()
        expect(service).toBeDefined()
    })

    describe('/ (POST)', () => {
        it('create a user', async () => {
            const res = await req.post(createDto)

            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchUserDto(createDto)
        })

        it('already exists email', async () => {
            const first = await req.post(createDto)
            const second = await req.post(createDto)

            expect(first.status).toEqual(HttpStatus.CREATED)
            expect(second.status).toEqual(HttpStatus.CONFLICT)
        })
    })

    describe('/:userId (GET)', () => {
        it('find a user', async () => {
            const createRes = await req.post(createDto)
            const findRes = await req.get(createRes.body.id)

            expect(findRes.status).toEqual(HttpStatus.OK)
            expect(findRes.body).toMatchUserDto(createDto)
        })

        it('user not found', async () => {
            const res = await req.get('unknown-id')

            expect(res.status).toEqual(HttpStatus.NOT_FOUND)
        })
    })

    describe('/:userId (PATCH)', () => {
        it('udpate a user', async () => {
            // create
            const createRes = await req.post(createDto)
            const userId = createRes.body.id

            // update
            const updateRes = await req.patch(userId, updateDto)

            // find the updated user.
            const findRes = await req.get(userId)

            expect(updateRes.status).toEqual(HttpStatus.OK)
            expect(updateRes.body).toMatchUserDto(updateDto)
            expect(findRes.body).toMatchUserDto(updateDto)
        })

        it('user not found', async () => {
            const updateRes = await req.patch('unknown-id', {})

            expect(updateRes.status).toEqual(HttpStatus.NOT_FOUND)
        })

        it('already exists user', async () => {
            const _firstRes = await req.post(firstDto)
            const secondRes = await req.post(secondDto)
            const secondId = secondRes.body.id

            // update second to first
            const updateRes = await req.patch(secondId, { email: 'B@mail.com', username: 'user' })

            expect(updateRes.status).toEqual(HttpStatus.CONFLICT)
        })
    })

    describe('/:userId (DELETE)', () => {
        it('remove a user', async () => {
            const createRes = await req.post(createDto)
            const userId = createRes.body.id
            const deleteRes = await req.delete(userId)
            const findRes = await req.get(userId)

            expect(deleteRes.status).toEqual(HttpStatus.OK)
            expect(deleteRes.body).toEqual({ id: userId })
            expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
        })

        it('user not found', async () => {
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

        it('find all users', async () => {
            const res = await req.get()
            const users = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(users.length).toEqual(3)
            expect(users[0].email).toEqual(createDtos[0].email)
            expect(users[1].email).toEqual(createDtos[1].email)
            expect(users[2].email).toEqual(createDtos[2].email)
        })

        it('pagination', async () => {
            const res = await req.get('?limit=5&offset=1')
            const users = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(res.body.offset).toEqual(1)
            expect(res.body.total).toEqual(3)
            expect(users.length).toEqual(2)
            expect(users[0].email).toEqual(createDtos[1].email)
            expect(users[1].email).toEqual(createDtos[2].email)
        })

        it('order by email:desc', async () => {
            const res = await req.get('?orderby=email:desc')
            const users = res.body.items

            expect(res.status).toEqual(HttpStatus.OK)
            expect(users.length).toEqual(3)
            expect(users[0].email).toEqual(createDtos[2].email)
            expect(users[1].email).toEqual(createDtos[1].email)
            expect(users[2].email).toEqual(createDtos[0].email)
        })

        it('order by wrong column name', async () => {
            const res = await req.get('?orderby=wrong:desc')

            expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
        })
    })
})

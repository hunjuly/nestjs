import { INestApplication } from '@nestjs/common'
import { closeApp, createApp, del, get, patch, post } from './common'

describe('UsersController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    async function createUser(email = 'default@ignore.com', password = 'default') {
        return post(app, '/users', { email, password })
    }

    // TODO e2e는 REST API가 아니라 description이 되어야 한다.
    it('/users (POST)', async () => {
        const res = await createUser('test@mail.com')

        const expected = expect.objectContaining({
            id: expect.any(String),
            email: 'test@mail.com'
        })

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(expected)
    })

    it('should be failed because user exists', async () => {
        const first = await createUser('test@mail.com')
        const second = await createUser('test@mail.com')

        expect(first.statusCode).toEqual(201)
        expect(second.statusCode).toEqual(409)
    })

    it('/users/:id (GET)', async () => {
        const createRes = await createUser('test2@mail.com')

        const entity = createRes.body as { id: string }

        const res = await get(app, `/users/${entity.id}`)

        const expected = expect.objectContaining({
            id: entity.id,
            email: 'test2@mail.com'
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expected)
    })

    it('/users (GET)', async () => {
        await createUser('test1@mail.com')
        await createUser('test2@mail.com')

        const res = await get(app, '/users')

        const expected = expect.objectContaining({ id: expect.any(String) })

        const result = res.body

        expect(res.statusCode).toEqual(200)
        expect(result.items.length).toEqual(2)
        expect(result.items[0]).toEqual(expected)
        expect(result.items[1]).toEqual(expected)
    })

    it('/users/:id (DELETE)', async () => {
        const createRes = await createUser()

        const entity = createRes.body as { id: string }

        const res1 = await del(app, `/users/${entity.id}`)
        const res2 = await get(app, `/users/${entity.id}`)

        expect(res1.statusCode).toEqual(200)
        expect(res2.statusCode).toEqual(404)
    })

    it('/users/:id (PATCH)', async () => {
        const createRes = await createUser()

        const entity = createRes.body as { id: string }

        const patchRes = await patch(app, `/users/${entity.id}`, { email: 'new@mail.com' })
        const getRes = await get(app, `/users/${entity.id}`)

        const expected = {
            id: entity.id,
            email: 'new@mail.com'
        }

        expect(patchRes.statusCode).toEqual(200)
        expect(getRes.body).toEqual(expect.objectContaining(expected))
    })
})

import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { CreateUserDto } from 'src/users/dto'

describe('user register, login & logout', () => {
    let app: INestApplication
    let users: TestRequest
    let auths: TestRequest

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()
        app = await createApp(module)
        users = createRequest(app, '/users')
        auths = createRequest(app, '/auths')
    })

    afterAll(async () => {
        await app.close()
    })

    describe('member', () => {
        const createDto = {
            username: 'user name',
            role: 'member',
            email: 'member@mail.com',
            password: '1234'
        } as CreateUserDto

        const loginDto = {
            email: 'member@mail.com',
            password: '1234'
        }

        let authCookie: string | null
        let userId: string | null

        it('create a member', async () => {
            const res = await users.post(createDto)

            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchObject({ id: expect.any(String) })

            userId = res.body.id
        })

        it('login & get authCookie', async () => {
            // login
            const res = await auths.post(loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            // auth cookie
            authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()
        })

        it('member api succeeds', async () => {
            const res = await users.get(userId).set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('admin api fails', async () => {
            const res = await users.delete(userId).set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('logout', async () => {
            const res = await auths.delete().set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('admin', () => {
        const createDto = {
            username: 'admin name',
            role: 'admin',
            email: 'admin@mail.com',
            password: '!@#$'
        } as CreateUserDto

        const loginDto = {
            email: 'admin@mail.com',
            password: '!@#$'
        }

        let authCookie: string | null
        let userId: string | null

        it('create an admin', async () => {
            const res = await users.post(createDto)

            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchObject({ id: expect.any(String) })

            userId = res.body.id
        })

        it('login & get authCookie', async () => {
            // login
            const res = await auths.post(loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            // auth cookie
            authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()
        })

        it('member api succeeds', async () => {
            const res = await users.get(userId).set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('admin api succeeds', async () => {
            const res = await users.delete(userId).set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('logout', async () => {
            const res = await auths.delete().set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })
})

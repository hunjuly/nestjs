import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { AuthsService } from '../auths.service'
import { admin, createAuthsTestingModule, member } from './mocks'

describe('/auths', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeAll(async () => {
        module = await createAuthsTestingModule()
        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)
    })

    afterAll(async () => {
        await app.close()
    })

    describe('member successful scenario', () => {
        let authCookie: string | null

        it('create an authentication', async () => {
            const res = await service.create(member.createDto)

            expect(res).toEqual({
                userId: expect.any(String),
                email: member.createDto.email
            })
        })

        it('login & get auth-cookie', async () => {
            // login
            const res = await req.post(member.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            // auth cookie
            authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()
        })

        it('the user-test succeeds', async () => {
            const res = await req.get('user-test').set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('the admin-test fails', async () => {
            const res = await req.get('admin-test').set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('logout', async () => {
            const res = await req.delete().set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('admin successful scenario', () => {
        let authCookie: string | null

        it('create an authentication', async () => {
            const res = await service.create(admin.createDto)

            expect(res).toEqual({
                userId: expect.any(String),
                email: admin.createDto.email
            })
        })

        it('login & get auth-cookie', async () => {
            // login
            const res = await req.post(admin.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            // auth cookie
            authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()
        })

        it('the user-test succeeds', async () => {
            const res = await req.get('user-test').set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('the admin-test succeeds', async () => {
            const res = await req.get('admin-test').set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('logout', async () => {
            const res = await req.delete().set('cookie', authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })
})

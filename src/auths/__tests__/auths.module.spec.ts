import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { GlobalModule } from 'src/global.module'
import { AuthsModule } from '../auths.module'
import { AuthsService } from '../auths.service'
import { admin, member } from './mocks'

describe('/auths', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [GlobalModule, AuthsModule]
        }).compile()

        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)

        console.log('beforeAll')
    })

    let authCookie: string | null

    afterAll(async () => {
        console.log('afterAll')
        await app.close()
    })

    it('create an authentication', async () => {
        await service.create(member.createDto)
    })

    it('login & get auth-cookie', async () => {
        // login
        const loginRes = await req.post(member.loginDto)
        expect(loginRes.status).toEqual(HttpStatus.CREATED)

        // auth cookie
        authCookie = loginRes.headers['set-cookie']
        expect(authCookie).not.toBeNull()
    })

    it('logout', async () => {
        const logoutRes = await req.delete().set('cookie', authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it.skip('admin required', async () => {
        await service.create(admin.createDto)
        await service.create(member.createDto)

        const adminRes = await req.post(admin.loginDto)
        const adminCookie = adminRes.headers['set-cookie']

        const memberRes = await req.post(member.loginDto)
        const memberCookie = memberRes.headers['set-cookie']

        const memberTestRes = await req.get('admin-test').set('cookie', memberCookie)
        expect(memberTestRes.status).toEqual(HttpStatus.FORBIDDEN)

        const adminTestRes = await req.get('admin-test').set('cookie', adminCookie)
        expect(adminTestRes.status).toEqual(HttpStatus.OK)
    })

    describe('failure cases', () => {
        it('already exists authentication', async () => {
            console.log('already exists')

            const promise = service.create(member.createDto)
            console.log('already exists2')

            await expect(promise).rejects.toThrow(Error)
        })

        it('incorrect password', async () => {
            const loginRes = await req.post({
                email: member.createDto.email,
                password: 'incorrect-password'
            })

            expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('not exists authentication', async () => {
            const loginRes = await req.post({
                email: 'unknown@mail.com',
                password: ''
            })

            expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('invalid token', async () => {
            const logoutRes = await req.delete().set('cookie', 'invalid-token')

            expect(logoutRes.status).toEqual(HttpStatus.FORBIDDEN)
        })
    })
})

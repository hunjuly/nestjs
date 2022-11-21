import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest, createTestingModule } from 'src/common/jest'
import { AuthsModule } from '../auths.module'
import { AuthsService } from '../auths.service'
import { adminDto, memberDto } from './mocks'

describe('/auth', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeEach(async () => {
        module = await createTestingModule({
            modules: [AuthsModule]
        })
        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('user successful case', async () => {
        // create an authentication
        await service.create(memberDto)

        // login
        const loginRes = await req.post({
            email: memberDto.email,
            password: memberDto.password
        })

        // auth token
        const authCookie = loginRes.headers['set-cookie']

        // logout
        const logoutRes = await req.delete(authCookie)

        expect(loginRes.status).toEqual(HttpStatus.CREATED)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('admin successful case', async () => {
        // create an authentication
        // await service.create(adminDto)
        // // login
        // const loginRes = await login(adminDto.email, adminDto.password)
        // expect(loginRes.status).toEqual(HttpStatus.CREATED)
        // // auth token
        // const authCookie = loginRes.headers['set-cookie']
        // // logout
        // const logoutRes = await logout(authCookie)
        // expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    describe('failure cases', () => {
        it('create auth, but already exists', async () => {
            await service.create(memberDto)

            const promise = await service.create(memberDto)

            await expect(promise).rejects.toThrow(Error)
        })

        it('login with incorrect password', async () => {
            await service.create(memberDto)

            const loginRes = await req.post({
                email: 'user@mail.com',
                password: 'incorrect-password'
            })

            expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('login with not exist email', async () => {
            const loginRes = await req.post({
                email: 'unknown@mail.com',
                password: ''
            })

            expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
    })
})

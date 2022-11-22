import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { ServiceRequest } from './mocks'

describe('user register, login & logout', () => {
    let app: INestApplication
    let req: ServiceRequest

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        req = new ServiceRequest(app)
    })

    afterEach(async () => {
        await app.close()
    })

    it('user successful case', async () => {
        const registerRes = await req.register('member')
        const userId = registerRes.body.id

        // login & get authCookie
        const loginRes = await req.login()
        expect(loginRes.status).toEqual(HttpStatus.CREATED)
        const authCookie = loginRes.headers['set-cookie']

        // use authCookie
        const infoRes = await req.getUser(userId, authCookie)

        // failed because required admin
        const failRes = await req.removeUser(userId, authCookie)

        // logout
        const logoutRes = await req.logout(authCookie)

        expect(registerRes.status).toEqual(HttpStatus.CREATED)
        expect(infoRes.status).toEqual(HttpStatus.OK)
        expect(failRes.status).toEqual(HttpStatus.FORBIDDEN)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('admin successful case', async () => {
        const registerRes = await req.register('admin')
        const userId = registerRes.body.id

        // login
        const loginRes = await req.login()
        const authCookie = loginRes.headers['set-cookie']

        // use authCookie
        const infoRes = await req.getUser(userId, authCookie)

        // use admin service
        const failRes = await req.removeUser(userId, authCookie)

        // logout
        const logoutRes = await req.logout(authCookie)

        expect(registerRes.status).toEqual(HttpStatus.CREATED)
        expect(loginRes.status).toEqual(HttpStatus.CREATED)
        expect(infoRes.status).toEqual(HttpStatus.OK)
        expect(failRes.status).toEqual(HttpStatus.OK)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })
})

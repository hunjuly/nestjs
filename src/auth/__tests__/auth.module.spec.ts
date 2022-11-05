import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as supertest from 'supertest'
import { GlobalModule } from 'src/global.module'
import { AuthModule } from '../auth.module'
import { AuthService } from '../auth.service'

describe('/auth', () => {
    let app: INestApplication
    let service: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, AuthModule]
        }).compile()

        service = module.get(AuthService)
        app = module.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    const request = () => supertest(app.getHttpServer())
    const login = async (email: string, password: string) => request().post('/auth').send({ email, password })
    const logout = (authCookie: string) => request().delete('/auth').set('Cookie', authCookie)
    const createUserAuth = () =>
        service.create({ userId: 'userId#1', email: 'user@mail.com', role: 'user', password: '1234' })
    const createAdminAuth = () =>
        service.create({ userId: 'userId#1', email: 'admin@mail.com', role: 'admin', password: '1234' })

    it('user successful case', async () => {
        // create an authentication
        await createUserAuth()

        // login
        const loginRes = await login('user@mail.com', '1234')
        expect(loginRes.status).toEqual(HttpStatus.CREATED)

        // auth token
        const authCookie = loginRes.headers['set-cookie']

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('admin successful case', async () => {
        // create an authentication
        await createAdminAuth()

        // login
        const loginRes = await login('admin@mail.com', '1234')
        expect(loginRes.status).toEqual(HttpStatus.CREATED)

        // auth token
        const authCookie = loginRes.headers['set-cookie']

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('create auth, but already exists', async () => {
        await createUserAuth()

        const promise = createUserAuth()

        await expect(promise).rejects.toThrow(Error)
    })

    it('login with incorrect password', async () => {
        await createUserAuth()

        const loginRes = await login('user@mail.com', 'incorrect-password')

        expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('login with not exist email', async () => {
        await createUserAuth()

        const loginRes = await login('unknown@mail.com', '')

        expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
})

import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as supertest from 'supertest'
import { createMemoryOrm } from 'src/common'
import { AuthModule } from '../auth.module'
import { AuthService } from '../auth.service'

describe('/auth', () => {
    let app: INestApplication
    let service: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AuthModule, createMemoryOrm()]
        }).compile()

        service = module.get(AuthService)
        app = module.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    function createAuth() {
        return service.create({
            userId: 'userId#1',
            email: 'user@mail.com',
            password: '1234'
        })
    }

    async function login(email: string, password: string) {
        return supertest(app.getHttpServer()).post('/auth').send({ email, password })
    }

    function logout(authCookie: string) {
        return supertest(app.getHttpServer()).delete('/auth').set('Cookie', authCookie)
    }

    it('successful case', async () => {
        // create an authentication
        await createAuth()

        // login
        const loginRes = await login('user@mail.com', '1234')
        expect(loginRes.status).toEqual(HttpStatus.CREATED)

        // auth token
        const authCookie = loginRes.headers['set-cookie']

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('create auth, but already exists', async () => {
        await createAuth()

        const promise = createAuth()

        await expect(promise).rejects.toThrow(Error)
    })

    it('login with incorrect password', async () => {
        await createAuth()

        const loginRes = await login('user@mail.com', 'incorrect-password')

        expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('login with not exist email', async () => {
        await createAuth()

        const loginRes = await login('unknown@mail.com', '')

        expect(loginRes.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
})

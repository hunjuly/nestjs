import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AuthModule } from 'src/auth'
import { createMemoryOrm } from 'src/common'
import { UsersModule } from 'src/users'

describe('user register, login & logout', () => {
    let app: INestApplication

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [createMemoryOrm(), UsersModule, AuthModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    async function register() {
        const createDto = { email: 'user@mail.com', password: '1234', username: 'user name' }

        return supertest(app.getHttpServer()).post('/users').send(createDto)
    }

    async function login() {
        return supertest(app.getHttpServer()).post('/auth').send({ email: 'user@mail.com', password: '1234' })
    }

    async function getUserInfo(userId: string, authCookie: string) {
        return supertest(app.getHttpServer())
            .get('/users/' + userId)
            .set('Cookie', authCookie)
    }

    function logout(authCookie: string) {
        return supertest(app.getHttpServer()).delete('/auth').set('Cookie', authCookie)
    }

    it('successful case', async () => {
        const registerRes = await register()
        expect(registerRes.status).toEqual(HttpStatus.CREATED)

        // login
        const loginRes = await login()
        expect(loginRes.status).toEqual(HttpStatus.CREATED)

        // authCookie
        const userId = registerRes.body.id
        const authCookie = loginRes.headers['set-cookie']

        // use authCookie
        const infoRes = await getUserInfo(userId, authCookie)
        expect(infoRes.status).toEqual(HttpStatus.OK)

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })
})

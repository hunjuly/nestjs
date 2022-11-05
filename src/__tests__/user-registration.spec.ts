import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AuthModule } from 'src/auth'
import { GlobalModule } from 'src/global.module'
import { UsersModule } from 'src/users'
import { UserRole } from 'src/users/domain'

describe('user register, login & logout', () => {
    let app: INestApplication

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, UsersModule, AuthModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    const request = () => supertest(app.getHttpServer())

    async function register(role: UserRole) {
        const createDto = {
            email: 'user@mail.com',
            password: '1234',
            username: 'user name',
            role
        }

        return request().post('/users').send(createDto)
    }

    async function login() {
        return request().post('/auth').send({ email: 'user@mail.com', password: '1234' })
    }

    async function getUserInfo(userId: string, authCookie: string) {
        return request()
            .get('/users/' + userId)
            .set('Cookie', authCookie)
    }

    async function removeUser(userId: string, authCookie: string) {
        return request()
            .delete('/users/' + userId)
            .set('Cookie', authCookie)
    }

    function logout(authCookie: string) {
        return request().delete('/auth').set('Cookie', authCookie)
    }

    it('user successful case', async () => {
        const registerRes = await register('user')
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

        // failed because required admin
        const failRes = await removeUser(userId, authCookie)
        expect(failRes.status).toEqual(HttpStatus.FORBIDDEN)

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })

    it('admin successful case', async () => {
        const registerRes = await register('admin')
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

        // use admin service
        const failRes = await removeUser(userId, authCookie)
        expect(failRes.status).toEqual(HttpStatus.OK)

        // logout
        const logoutRes = await logout(authCookie)
        expect(logoutRes.status).toEqual(HttpStatus.OK)
    })
})

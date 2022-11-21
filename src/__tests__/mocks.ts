import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { UserRole } from 'src/users/domain'

export class ServiceRequest {
    private request = () => supertest(this.app.getHttpServer())

    constructor(private app: INestApplication) {}

    register(role: UserRole) {
        const createDto = {
            email: 'user@mail.com',
            password: '1234',
            username: 'user name',
            role
        }

        return this.request().post('/users').send(createDto)
    }

    login() {
        const loginDto = { email: 'user@mail.com', password: '1234' }

        return this.request().post('/auth').send(loginDto)
    }

    getUser(userId: string, authCookie: string) {
        return this.request()
            .get('/users/' + userId)
            .set('Cookie', authCookie)
    }

    removeUser(userId: string, authCookie: string) {
        return this.request()
            .delete('/users/' + userId)
            .set('Cookie', authCookie)
    }

    logout(authCookie: string) {
        return this.request().delete('/auth').set('Cookie', authCookie)
    }
}
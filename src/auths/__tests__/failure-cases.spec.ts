import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { AuthsService } from '../auths.service'
import { createAuthsTestingModule, member } from './mocks'

describe('failure cases', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeEach(async () => {
        module = await createAuthsTestingModule()
        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('already exists authentication', async () => {
        await service.create(member.createDto)

        const promise = service.create(member.createDto)

        await expect(promise).rejects.toThrow(Error)
    })

    it('incorrect password', async () => {
        await service.create(member.createDto)

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

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
        const promise1 = service.create(member.createDto)
        await expect(promise1).resolves.not.toBeNull()

        const promise2 = service.create(member.createDto)
        await expect(promise2).rejects.toThrow(Error)
    })

    it('incorrect password', async () => {
        await service.create(member.createDto)

        const res = await req.post({
            email: member.createDto.email,
            password: 'incorrect-password'
        })

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('not exists authentication', async () => {
        const res = await req.post({
            email: 'unknown@mail.com',
            password: ''
        })

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('invalid token', async () => {
        const res = await req.delete().set('cookie', 'invalid-token')

        expect(res.status).toEqual(HttpStatus.FORBIDDEN)
    })
})

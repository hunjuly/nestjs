import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, UserGuard } from 'src/auth'
import { GlobalModule } from 'src/global.module'

export function createSpy(object: any, method: string, args: any[] | undefined | null, response: any) {
    return jest.spyOn(object, method).mockImplementation(async (...recv) => {
        if (args) {
            expect(recv).toEqual(args)
        }

        return response
    })
}

export function createTypeOrmMock() {
    return {
        findOneBy: jest.fn(),
        findAndCount: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    }
}

export class MockAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}

export async function createModule(injections: { modules?: any[]; controllers?: any[]; providers?: any[] }) {
    const modules = injections.modules ?? []
    const controllers = injections.controllers ?? []
    const providers = injections.providers ?? []

    const builder = Test.createTestingModule({
        imports: [GlobalModule, ...modules],
        controllers,
        providers
    })
    builder.overrideGuard(UserGuard).useClass(MockAuthGuard)
    builder.overrideGuard(AdminGuard).useClass(MockAuthGuard)

    const module = await builder.compile()

    return module
}
export async function createApp(module: TestingModule) {
    const app = module.createNestApplication()
    await app.init()

    return app
}

export function createRequest(app: INestApplication, path: string): TestRequest {
    const request = () => supertest(app.getHttpServer())

    return {
        post: (body: string | object, query?: string) =>
            request()
                .post(path + '/' + (query ?? ''))
                .send(body),
        put: (id: string, body: string | object) =>
            request()
                .put(path + '/' + id)
                .send(body),
        patch: (id: string, body: string | object) =>
            request()
                .patch(path + '/' + id)
                .send(body),
        get: (query?: string) => request().get(path + '/' + (query ?? '')),
        delete: (query: string) => request().delete(path + '/' + query)
    }
}

export type TestRequest = {
    post: (body: string | object, query?: string) => supertest.Test
    put: (id: string, body: string | object) => supertest.Test
    patch: (id: string, body: string | object) => supertest.Test
    get: (query?: string) => supertest.Test
    delete: (query: string) => supertest.Test
}

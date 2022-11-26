import { CanActivate, ExecutionContext, INestApplication, LogLevel, LoggerService } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, SelfGuard } from 'src/auths'
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

class MockAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}

export class MockLogger implements LoggerService {
    log(_message: any, ..._optionalParams: any[]): any {}
    error(_message: any, ..._optionalParams: any[]): any {}
    warn(_message: any, ..._optionalParams: any[]): any {}
    debug?(_message: any, ..._optionalParams: any[]): any {}
    verbose?(_message: any, ..._optionalParams: any[]): any {}
    setLogLevels?(_levels: LogLevel[]): any {}
}

export async function createTestingModule(injections: {
    modules?: any[]
    controllers?: any[]
    providers?: any[]
}) {
    const modules = injections.modules ?? []
    const controllers = injections.controllers ?? []
    const providers = injections.providers ?? []

    const builder = Test.createTestingModule({
        imports: [GlobalModule, ...modules],
        controllers,
        providers
    })
    builder.overrideGuard(SelfGuard).useClass(MockAuthGuard)
    builder.overrideGuard(AdminGuard).useClass(MockAuthGuard)

    const module = await builder.compile()

    return module
}
export async function createApp(module: TestingModule) {
    const app = module.createNestApplication()
    app.useLogger(new MockLogger())

    await app.init()

    return app
}

export function createRequest(app: INestApplication, path: string): TestRequest {
    const request = () => supertest(app.getHttpServer())

    return {
        post: (body: string | object, query = '') =>
            request()
                .post(path + '/' + query)
                .send(body),
        put: (id: string, body: string | object) =>
            request()
                .put(path + '/' + id)
                .send(body),
        patch: (id: string, body: string | object) =>
            request()
                .patch(path + '/' + id)
                .send(body),
        get: (query = '') => request().get(path + '/' + query),
        delete: (query = '') => request().delete(path + '/' + query)
    }
}

export type TestRequest = {
    post: (body: string | object, query?: string) => supertest.Test
    put: (id: string, body: string | object) => supertest.Test
    patch: (id: string, body: string | object) => supertest.Test
    get: (query?: string) => supertest.Test
    delete: (query?: string) => supertest.Test
}

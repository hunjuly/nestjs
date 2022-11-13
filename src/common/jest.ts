import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
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

export type TestRequest = {
    post: (path: string, body: string | object) => supertest.Test
    put: (path: string, body: string | object) => supertest.Test
    patch: (path: string, body: string | object) => supertest.Test
    get: (path: string) => supertest.Test
    delete: (path: string) => supertest.Test
}

export async function createModule(modules: any[]) {
    const builder = Test.createTestingModule({ imports: [GlobalModule, ...modules] })
    builder.overrideGuard(UserGuard).useClass(MockAuthGuard)
    builder.overrideGuard(AdminGuard).useClass(MockAuthGuard)

    const module = await builder.compile()
    const app = module.createNestApplication()
    await app.init()

    const request = () => supertest(app.getHttpServer())

    return {
        module,
        request: {
            post: (path: string, body: string | object) => request().post(path).send(body),
            put: (path: string, body: string | object) => request().put(path).send(body),
            patch: (path: string, body: string | object) => request().patch(path).send(body),
            get: (path: string) => request().get(path),
            delete: (path: string) => request().delete(path)
        },
        close: () => app.close()
    }
}

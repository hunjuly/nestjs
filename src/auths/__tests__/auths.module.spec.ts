import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SystemException } from 'src/common'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { GlobalModule } from 'src/global.module'
import { AuthsModule } from '../auths.module'
import { AuthsService } from '../auths.service'
import { CreateAuthDto } from '../auths.service'

// 사용자 삭제하면 토큰 무효화 하는가?
// google: oauth token validation user removed
// https://social.msdn.microsoft.com/forums/en-US/09300817-edb4-460e-9d09-f907658d41a6/how-to-know-if-user-has-been-deactivateddeleted-and-remove-access-token?forum=aspwebapi
// 베어러 토큰은 암호화를 통해 보안된 엔드포인트에서 자체 포함되고 검증됩니다.
// 실시간 상태가 필요하다면 보안된 엔드포인트에 대한 모든 요청에 대해 사용자의 상태를 확인하는 코드를 작성하기만 하면 됩니다.

describe('/auths', () => {
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, AuthsModule]
        }).compile()

        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)
    })

    afterAll(async () => {
        await app.close()
    })

    describe('1. auth 생성', () => {
        it('member', async () => {
            const auth = await service.create(member.createDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })

        it('admin', async () => {
            const auth = await service.create(admin.createDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })

        it('이미 존재하는 auth는 실패한다', async () => {
            const promise = service.create(member.createDto)

            await expect(promise).rejects.toThrow(SystemException)
        })
    })

    describe('2. login', () => {
        it('member', async () => {
            const res = await req.post(member.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            const authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()

            member.authCookie = authCookie
        })

        it('admin', async () => {
            const res = await req.post(admin.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            const authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()

            admin.authCookie = authCookie
        })

        it('password가 틀림', async () => {
            const res = await req.post({
                ...member.loginDto,
                password: 'wrong'
            })

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('email이 존재하지 않음', async () => {
            const res = await req.post({
                ...member.loginDto,
                email: 'unknown@mail.com'
            })

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
    })

    describe('3. user authorization', () => {
        it('SelfGuard', async () => {
            const path = 'test/self-guard/' + member.userId

            const memberRes = await req.get(path).set('cookie', member.authCookie)
            expect(memberRes.status).toEqual(HttpStatus.OK)

            const adminRes = await req.get(path).set('cookie', admin.authCookie)
            expect(adminRes.status).toEqual(HttpStatus.OK)
        })
        it('AdminGuard', async () => {
            const method = 'test/admin-guard'

            const memberRes = await req.get(method).set('cookie', member.authCookie)
            expect(memberRes.status).toEqual(HttpStatus.FORBIDDEN)

            const adminRes = await req.get(method).set('cookie', admin.authCookie)
            expect(adminRes.status).toEqual(HttpStatus.OK)
        })

        it('invalid cookie', async () => {
            const res = await req.delete().set('cookie', 'invalid-token')

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })
    })

    describe('4. auth 삭제', () => {
        it('member', async () => {
            const success = await service.remove(member.userId)

            expect(success).toBeTruthy()
        })
    })

    describe('5. logout', () => {
        it('member는 삭제돼서 logout 불가', async () => {
            const res = await req.delete().set('cookie', member.authCookie)

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('admin은 logout 가능', async () => {
            const res = await req.delete().set('cookie', admin.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('6. login, again', () => {
        it('member는 삭제돼서 login 불가', async () => {
            const res = await req.post(member.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('admin은 login 가능', async () => {
            const res = await req.post(admin.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
        })
    })
})

const member = {
    createDto: {
        userId: 'memberA',
        role: 'member',
        email: 'memberA@mail.com',
        password: '1234'
    } as CreateAuthDto,
    loginDto: {
        email: 'memberA@mail.com',
        password: '1234'
    },
    authCookie: null,
    userId: 'memberA'
}

const admin = {
    createDto: {
        userId: 'adminA',
        role: 'admin',
        email: 'adminA@mail.com',
        password: '!@#$'
    } as CreateAuthDto,
    loginDto: {
        email: 'adminA@mail.com',
        password: '!@#$'
    },
    authCookie: null,
    userId: 'adminA'
}

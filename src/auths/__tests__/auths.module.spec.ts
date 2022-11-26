import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { AuthsService } from '../auths.service'
import { admin, createAuthsTestingModule, member } from './mocks'

// TODO 권한문제, 자기자신 혹은 admin을 어떻게 알 수 있는가? 새로운 가드가 필요하다.
// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6#file-self-decorator-ts

// TODO 시스템 오류 시 어떻게 멈추나.
// https://stackoverflow.com/questions/57146395/how-to-trigger-application-shutdown-from-a-service-in-nest-js

// TODO 사용자 삭제하면 토큰 무효화 하는가?
// google: oauth token validation user removed
// https://social.msdn.microsoft.com/forums/en-US/09300817-edb4-460e-9d09-f907658d41a6/how-to-know-if-user-has-been-deactivateddeleted-and-remove-access-token?forum=aspwebapi
// 베어러 토큰은 암호화를 통해 보안된 엔드포인트에서 자체 포함되고 검증됩니다.
// 실시간 상태가 필요하다면 보안된 엔드포인트에 대한 모든 요청에 대해 사용자의 상태를 확인하는 코드를 작성하기만 하면 됩니다.

describe('/auths', () => {
    let module: TestingModule
    let app: INestApplication
    let req: TestRequest

    let service: AuthsService

    beforeAll(async () => {
        module = await createAuthsTestingModule()
        app = await createApp(module)
        req = createRequest(app, '/auths')

        service = module.get(AuthsService)
    })

    afterAll(async () => {
        await app.close()
    })

    describe('1. 사용자 등록', () => {
        it('member', async () => {
            const auth = await service.create(member.createDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })

        it('admin', async () => {
            const auth = await service.create(admin.createDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })
    })

    describe('2. 로그인', () => {
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
    })

    describe('3. 서비스 사용', () => {
        it('member는 멤버 서비스 사용 가능', async () => {
            const res = await req.get('member-test').set('cookie', member.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
        it('member는 관리자 서비스 사용 불가', async () => {
            const res = await req.get('admin-test').set('cookie', member.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('admin는 관리자 서비스 사용 가능', async () => {
            const res = await req.get('admin-test').set('cookie', admin.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('4. 사용자 삭제', () => {
        it('member', async () => {
            const success = await service.remove(member.userId)

            expect(success).toBeTruthy()
        })
    })

    describe('5. logout', () => {
        it('삭제된 member는 로그아웃 불가', async () => {
            const res = await req.delete().set('cookie', member.authCookie)

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('admin은 로그아웃 가능', async () => {
            const res = await req.delete().set('cookie', admin.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('6. 재로그인', () => {
        it('삭제된 member는 로그인 불가', async () => {
            const res = await req.post(member.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('admin는 로그인 가능', async () => {
            const res = await req.post(admin.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
        })
    })
})

import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { CreateUserDto } from 'src/users/dto'

// TODO 권한문제, 자기자신 혹은 admin을 어떻게 알 수 있는가? 새로운 가드가 필요하다.
// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6#file-self-decorator-ts
// TODO 시스템 오류 시 어떻게 멈추나.
// https://stackoverflow.com/questions/57146395/how-to-trigger-application-shutdown-from-a-service-in-nest-js

// TODO 사용자 삭제하면 토큰 무효화 하는가?
// google: oauth token validation user removed
// https://social.msdn.microsoft.com/forums/en-US/09300817-edb4-460e-9d09-f907658d41a6/how-to-know-if-user-has-been-deactivateddeleted-and-remove-access-token?forum=aspwebapi
// 베어러 토큰은 암호화를 통해 보안된 엔드포인트에서 자체 포함되고 검증됩니다.
// 실시간 상태가 필요하다면 보안된 엔드포인트에 대한 모든 요청에 대해 사용자의 상태를 확인하는 코드를 작성하기만 하면 됩니다.

describe('user register, login & logout', () => {
    let app: INestApplication
    let users: TestRequest
    let auths: TestRequest

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()
        app = await createApp(module)
        users = createRequest(app, '/users')
        auths = createRequest(app, '/auths')
    })

    afterAll(async () => {
        await app.close()
    })

    describe('1. 사용자 등록', () => {
        it('memberA', async () => {
            const res = await users.post(memberA.createDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchObject({ id: expect.any(String) })

            memberA.userId = res.body.id
        })

        it('memberB', async () => {
            const res = await users.post(memberB.createDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchObject({ id: expect.any(String) })

            memberB.userId = res.body.id
        })

        it('adminA', async () => {
            const res = await users.post(adminA.createDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
            expect(res.body).toMatchObject({ id: expect.any(String) })

            adminA.userId = res.body.id
        })
    })

    describe('2. 로그인', () => {
        it('memberA', async () => {
            const res = await auths.post(memberA.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            const authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()

            memberA.authCookie = authCookie
        })

        it('adminA', async () => {
            const res = await auths.post(adminA.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)

            const authCookie = res.headers['set-cookie']
            expect(authCookie).not.toBeNull()

            adminA.authCookie = authCookie
        })
    })

    describe('3. 서비스 사용', () => {
        it('memberA는 서비스 사용 가능', async () => {
            const res = await users.get(memberA.userId).set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
        it('memberA는 관리자 서비스 사용 불가', async () => {
            const res = await users.get().set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('adminA는 관리자 서비스 사용 가능', async () => {
            const res = await users.get().set('cookie', adminA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('5. 사용자 삭제', () => {
        it('memberA가 memberB 삭제 불가', async () => {
            const res = await users.delete(memberB.userId).set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('memberA 자신은 삭제 가능', async () => {
            const res = await users.delete(memberA.userId).set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('adminA는 memberB 삭제 가능', async () => {
            const res = await users.delete(memberB.userId).set('cookie', adminA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })

        it('삭제된 memberA는 서비스 사용 불가', async () => {
            const res = await users.get(memberA.userId).set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })
    })

    describe('6. logout', () => {
        it('삭제된 memberA는 로그아웃 불가', async () => {
            const res = await auths.delete().set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('adminA는 로그아웃 가능', async () => {
            const res = await auths.delete().set('cookie', adminA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('7. 재로그인', () => {
        it('삭제된 memberA는 로그인 불가', async () => {
            const res = await auths.post(memberA.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('삭제된 memberB는 로그인 불가', async () => {
            const res = await auths.post(memberB.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('adminA는 로그인 가능', async () => {
            const res = await auths.post(adminA.loginDto)
            expect(res.status).toEqual(HttpStatus.CREATED)
        })
    })
})

const memberA = {
    createDto: {
        username: 'memberA',
        role: 'member',
        email: 'memberA@mail.com',
        password: '1234'
    } as CreateUserDto,
    loginDto: {
        email: 'memberA@mail.com',
        password: '1234'
    },
    authCookie: null,
    userId: null
}

const memberB = {
    createDto: {
        username: 'memberB',
        role: 'member',
        email: 'memberB@mail.com',
        password: 'abcd'
    } as CreateUserDto,
    loginDto: {
        email: 'memberB@mail.com',
        password: 'abcd'
    },
    authCookie: null,
    userId: null
}

const adminA = {
    createDto: {
        username: 'adminA',
        role: 'admin',
        email: 'adminA@mail.com',
        password: '!@#$'
    } as CreateUserDto,
    loginDto: {
        email: 'adminA@mail.com',
        password: '!@#$'
    },
    authCookie: null,
    userId: null
}

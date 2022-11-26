import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { CreateUserDto } from 'src/users/dto'

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

    describe('3. 사용자 권한', () => {
        it('memberA는 멤버 서비스 사용 가능', async () => {
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

    describe('4. 사용자 삭제', () => {
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

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
    })

    describe('5. 로그아웃', () => {
        it('삭제된 memberA는 로그아웃 불가', async () => {
            const res = await auths.delete().set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('adminA는 로그아웃 가능', async () => {
            const res = await auths.delete().set('cookie', adminA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('6. 재로그인', () => {
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

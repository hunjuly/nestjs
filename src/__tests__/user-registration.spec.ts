import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { CreateUserDto } from 'src/users/dto'

// TODO 권한문제, 자기자신 혹은 admin을 어떻게 알 수 있는가? 새로운 가드가 필요하다.
// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6#file-self-decorator-ts
// TODO 시스템 오류 시 어떻게 멈추나.
// https://stackoverflow.com/questions/57146395/how-to-trigger-application-shutdown-from-a-service-in-nest-js

/*
1. register memberA, memberB, adminA
2. memberA,adminA login succeeds
3. memberA가 memberB 삭제 실패
4. memberA가 memberA 삭제 성공
5. adminA가 memberB 삭제 성공
5. adminA가 adminA 삭제 성공
6. memberA logout ?실패인가?, memberB logout 실패, adminA logout
7. memberA,memberB,adminA login 실패
*/

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

    describe('1. register memberA, memberB, adminA', () => {
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

    describe('2. memberA, adminA login succeeds', () => {
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

    it('3. memberA가 memberB 삭제 실패', async () => {
        const res = await users.delete(memberB.userId).set('cookie', memberA.authCookie)

        expect(res.status).toEqual(HttpStatus.FORBIDDEN)
    })

    it('4. memberA가 memberA 삭제 성공', async () => {
        const res = await users.delete(memberA.userId).set('cookie', memberA.authCookie)

        expect(res.status).toEqual(HttpStatus.OK)
    })

    it('5. adminA가 memberB 삭제 성공', async () => {
        const res = await users.delete(memberB.userId).set('cookie', adminA.authCookie)

        expect(res.status).toEqual(HttpStatus.OK)
    })

    it('6. adminA가 adminA 삭제 성공', async () => {
        const res = await users.delete(adminA.userId).set('cookie', adminA.authCookie)

        expect(res.status).toEqual(HttpStatus.OK)
    })

    describe('7. logout', () => {
        it('memberA failed', async () => {
            const res = await auths.delete().set('cookie', memberA.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('memberB failed', async () => {
            const res = await auths.delete().set('cookie', memberB.authCookie)

            expect(res.status).toEqual(HttpStatus.FORBIDDEN)
        })

        it('adminA succeeds', async () => {
            const res = await auths.delete().set('cookie', adminA.authCookie)

            expect(res.status).toEqual(HttpStatus.OK)
        })
    })

    describe('8. memberA, memberB, adminA login 실패', () => {
        it('memberA', async () => {
            const res = await auths.post(memberA.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('memberB', async () => {
            const res = await auths.post(memberB.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('adminA', async () => {
            const res = await auths.post(adminA.loginDto)
            expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
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

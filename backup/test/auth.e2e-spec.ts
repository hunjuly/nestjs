import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { del, get, post } from './common'

let app: INestApplication

beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
})

afterEach(async () => {
    await app.close()
})

it('authentication (e2e)', async () => {
    const userId = await createUser()

    const cookie = await login()

    const res = await getUser(userId, cookie)
    expect(res.statusCode).toEqual(200)

    await logout(cookie)

    const res2 = await getUser(userId, cookie)
    expect(res2.statusCode).toEqual(403)
})

async function createUser() {
    // curl http://localhost:4000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
    const res = await post(app, '/users', { email: 'test@mail.com', password: 'testpass' })

    expect(res.statusCode).toEqual(201)

    return res.body.id
}

async function login() {
    // curl http://localhost:4000/auth -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v
    const res = await post(app, '/auth', { email: 'test@mail.com', password: 'testpass' })

    expect(res.statusCode).toEqual(201)

    // < Set-Cookie: connect.sid=s%3AQu2pnp84rzMhMik5w1w8ijslwStFT1Ow0; Path=/; HttpOnly
    const cookies = res.headers['set-cookie'][0].split(';')

    return cookies[0]
}

async function getUser(userId: string, cookie: string) {
    // curl http://localhost:4000/users --cookie "connect.sid=s%3AgG58r3EKXC5qaUhqGXyO8040PezYsuoN.OYCMovyhtUQPdBv0da6HvFzmaRoD%2BARpJRXfeGMuks0;"
    const res = await get(app, `/users/${userId}`, [{ cookie }])

    return res
}

async function logout(cookie: string) {
    // curl -X DELETE http://localhost:4000/auth --cookie "connect.sid=s%3AL8rdAzms8Xu-WJDC_b1KKhK4CgP2aoe8.c8%2FPvvdHZqykmLY35gE08wMVX7QwMvuoJ7A4JkBqYOg;"
    const res = await del(app, '/auth', [{ cookie }])

    expect(res.statusCode).toEqual(200)
}

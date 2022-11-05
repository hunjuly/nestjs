import { CanActivate, ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, UserGuard } from 'src/auth'
import { createMemoryOrm } from 'src/common'
import { GlobalModule } from 'src/global.module'
import { UserRole } from '../domain'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UserDto } from '../dto/user.dto'
import { UsersModule } from '../users.module'
import { UsersService } from '../users.service'

class MockAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}

describe('/users', () => {
    let app: INestApplication
    let service: UsersService

    const createDto = {
        email: 'user@mail.com',
        username: 'user name',
        role: 'user' as UserRole,
        password: '1234'
    }

    const request = () => supertest(app.getHttpServer())
    const createUser = (dto: CreateUserDto) => request().post('/users').send(dto)
    const findAllUsers = () => request().get('/users')
    const findUser = (userId: string) => request().get('/users/' + userId)
    const deleteUser = (userId: string) => request().delete('/users/' + userId)

    const updateUser = (userId: string, dto: UpdateUserDto) =>
        request()
            .patch('/users/' + userId)
            .send(dto)

    const expectUserDto = (user: UserDto, dto: CreateUserDto | UpdateUserDto) => {
        const received = {
            id: user.id,
            email: user.email,
            username: user.username,
            createDate: new Date(user.createDate),
            updateDate: new Date(user.updateDate)
        }

        const expected = expect.objectContaining({
            id: expect.any(String),
            email: dto.email,
            username: dto.username,
            createDate: expect.any(Date),
            updateDate: expect.any(Date)
        })

        expect(received).toEqual(expected)
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [GlobalModule, UsersModule]
        })
            .overrideGuard(UserGuard)
            .useClass(MockAuthGuard)
            .overrideGuard(AdminGuard)
            .useClass(MockAuthGuard)
            .compile()

        app = module.createNestApplication()
        await app.init()

        service = module.get(UsersService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(app).toBeDefined()
        expect(service).toBeDefined()
    })

    it('/ (POST), create a user', async () => {
        const create = await createUser(createDto)

        expect(create.status).toEqual(HttpStatus.CREATED)
        expectUserDto(create.body, createDto)
    })

    it('create a user, but already exists email', async () => {
        const success = await createUser(createDto)
        expect(success.status).toEqual(HttpStatus.CREATED)

        const fail = await createUser(createDto)
        expect(fail.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/ (GET), find all users', async () => {
        // create users
        await createUser({ email: 'user1@mail.com', username: 'username', role: 'user', password: '1234' })
        await createUser({ email: 'user2@mail.com', username: 'username', role: 'user', password: '1234' })
        await createUser({ email: 'user3@mail.com', username: 'username', role: 'user', password: '1234' })

        // find all
        const find = await findAllUsers()
        const users = find.body

        // verify
        expect(find.status).toEqual(HttpStatus.OK)
        expect(users.length).toEqual(3)
        expect(users[0].email).toEqual('user1@mail.com')
        expect(users[1].email).toEqual('user2@mail.com')
        expect(users[2].email).toEqual('user3@mail.com')
    })

    it('/:userId (GET), find a user', async () => {
        // create a user
        const { body } = await createUser(createDto)

        // find the user
        const find = await findUser(body.id)

        // verify
        expect(find.status).toEqual(HttpStatus.OK)
        expectUserDto(find.body, createDto)
    })

    it('find a user, but not found', async () => {
        const find = await findUser('unknown-id')

        expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('/:userId (PATCH), udpate a user', async () => {
        // create
        const create = await createUser(createDto)
        const user = create.body

        // update the user
        const updateDto = { email: 'new@mail.com', username: 'new name' }
        const update = await updateUser(user.id, updateDto)
        expect(update.status).toEqual(HttpStatus.OK)
        expectUserDto(update.body, updateDto)

        // find the user
        const find = await findUser(user.id)
        expect(find.body).toMatchObject(updateDto)
    })

    it('udpate a user, but not found', async () => {
        const update = await updateUser('unknown-id', {})

        expect(update.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('udpate a user,  but already exists email', async () => {
        // create A
        const createA = await createUser({
            email: 'A@mail.com',
            username: 'user',
            role: 'user',
            password: '1234'
        })
        const userA = createA.body

        // create B@mail.com
        await createUser({
            email: 'B@mail.com',
            username: 'user',
            role: 'user',
            password: '1234'
        })

        // update A, but already exists email
        const res = await updateUser(userA.id, { email: 'B@mail.com', username: 'user' })

        expect(res.status).toEqual(HttpStatus.CONFLICT)
    })

    it('/:userId (DELETE), remove a user', async () => {
        // create a user
        const create = await createUser(createDto)
        const user = create.body

        // delete the user
        const delete_ = await deleteUser(user.id)
        expect(delete_.status).toEqual(HttpStatus.OK)
        expect(delete_.body).toEqual({ id: user.id })

        // find the deleted user
        const find = await findUser(user.id)
        expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('remove a user, but not found', async () => {
        const delete_ = await deleteUser('unknown-id')

        expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
    })
})

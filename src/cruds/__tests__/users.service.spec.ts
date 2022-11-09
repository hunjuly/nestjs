import { Test } from '@nestjs/testing'
import { Authentication } from 'src/services/auth'
import { AuthService } from 'src/services/auth/auth.service'
import { User } from './domain'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

jest.mock('src/services/auth/auth.service')
jest.mock('./users.repository')

describe('UsersService', () => {
    let service: UsersService
    let repository: UsersRepository
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService, AuthService, UsersRepository]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
        repository = module.get(UsersRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    const userId = 'uuid#1'
    const email = 'user@mail.com'
    const password = 'pass#001'

    const user = { id: userId, email } as User
    const auth = { userId, email } as Authentication

    const users = [
        { id: 'uuid#1', email: 'user1@test.com' },
        { id: 'uuid#2', email: 'user2@test.com' }
    ] as User[]

    it('create a user', async () => {
        const userCandidate = { id: undefined, email } as User

        fixture({
            object: repository,
            method: 'create',
            args: [userCandidate],
            return: user
        })

        const createAuthDto = { userId, email, password }

        fixture({
            object: authService,
            method: 'create',
            args: [createAuthDto],
            return: auth
        })

        const createUserDto = { email, password }

        const recv = await service.create(createUserDto)

        expect(recv).toMatchObject(user)
    })

    it('find all users ', async () => {
        const page = { offset: 0, limit: 10 }
        const pagedUsers = { ...page, total: 2, items: users }

        fixture({
            object: repository,
            method: 'findAll',
            args: [page],
            return: pagedUsers
        })

        const recv = await service.findAll(page)

        expect(recv.items).toMatchArray(pagedUsers.items)
    })

    it('find a user', async () => {
        fixture({
            object: repository,
            method: 'get',
            args: [userId],
            return: user
        })

        const recv = await service.get(userId)

        expect(recv).toMatchObject(user)
    })

    it('remove a user', async () => {
        fixture({
            object: repository,
            method: 'get',
            args: [userId],
            return: user
        })

        fixture({
            object: repository,
            method: 'remove',
            args: [userId],
            return: true
        })

        const recv = await service.remove(userId)

        expect(recv).toMatchObject({ id: userId })
    })

    it('update a user', async () => {})
})

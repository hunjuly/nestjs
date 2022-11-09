import { Test } from '@nestjs/testing'
import { User } from './domain'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

jest.mock('./users.service')

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService]
        }).compile()

        controller = module.get(UsersController)
        service = module.get(UsersService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    const userId = 'uuid#1'
    const email = 'user@mail.com'
    const password = 'pass#001'

    const user = { id: userId, email } as User

    const users = [
        { id: 'uuid#1', email: 'user1@test.com' },
        { id: 'uuid#2', email: 'user2@test.com' }
    ] as User[]

    it('create', async () => {
        const createDto = { email, password }

        fixture({
            object: service,
            method: 'create',
            args: [createDto],
            return: user
        })

        const recv = await controller.create(createDto)

        expect(recv).toMatchObject(user)
        expect(recv).toHaveProperty('url')
    })

    it('findAll', async () => {
        const page = { offset: 0, limit: 10 }
        const pagedUsers = { ...page, total: 2, items: users }

        fixture({
            object: service,
            method: 'findAll',
            args: [page],
            return: pagedUsers
        })

        const recv = await controller.findAll(page)

        expect(recv.items).toMatchArray(pagedUsers.items)
        expect(recv.items[0]).toHaveProperty('url')
    })

    it('findOne', async () => {
        fixture({
            object: service,
            method: 'get',
            args: [userId],
            return: user
        })

        const recv = await controller.findOne(userId)

        expect(recv).toMatchObject(user)
        expect(recv).toHaveProperty('url')
    })

    it('remove', async () => {
        const removeResult = { id: userId }

        fixture({
            object: service,
            method: 'remove',
            args: [userId],
            return: removeResult
        })

        const recv = await controller.remove(userId)

        expect(recv).toMatchObject(removeResult)
    })

    it('update', async () => {
        const updateDto = { password: 'newpass' }
        const updatedUser = { ...user, email: 'new@mail.com' }

        fixture({
            object: service,
            method: 'update',
            args: [userId, updateDto],
            return: updatedUser
        })

        const recv = await controller.update(userId, updateDto)

        expect(recv).toMatchObject(updatedUser)
    })
})

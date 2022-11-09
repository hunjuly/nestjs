import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './domain'
import { UsersRepository } from './users.repository'

describe('UsersRepository', () => {
    let repository: UsersRepository
    let typeorm: Repository<User>

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersRepository,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOneBy: jest.fn(),
                        findAndCount: jest.fn(),
                        delete: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn()
                    }
                }
            ]
        }).compile()

        repository = module.get(UsersRepository)
        typeorm = module.get(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    const userId = 'uuid#1'
    const email = 'user@mail.com'

    const user = { id: userId, email } as User

    const users = [
        { id: 'uuid#1', email: 'user1@test.com' },
        { id: 'uuid#2', email: 'user2@test.com' }
    ] as User[]

    it('create', async () => {
        const userCandidate = { id: undefined, email } as User

        fixture({
            object: typeorm,
            method: 'save',
            args: [userCandidate],
            return: user
        })

        const recv = await repository.create(userCandidate)

        expect(recv).toEqual(user)
    })

    it('findAll', async () => {
        const page = { offset: 0, limit: 10 }

        fixture({
            object: typeorm,
            method: 'findAndCount',
            args: [{ skip: 0, take: 10, order: { id: 'DESC' } }],
            return: [users, 4]
        })

        const recv = await repository.findAll(page)

        expect(recv.total).toEqual(4)
        expect(recv.items).toEqual(users)
    })

    it('get', async () => {
        fixture({
            object: typeorm,
            method: 'findOneBy',
            args: [{ id: userId }],
            return: user
        })

        const recv = await repository.get(userId)

        expect(recv).toEqual(user)
    })

    it('remove', async () => {
        fixture({
            object: typeorm,
            method: 'delete',
            args: [userId],
            return: { affected: 1 }
        })

        const recv = await repository.remove(userId)

        expect(recv).toBeTruthy()
    })

    it('update', async () => {
        const updateDto = { password: 'newpass' }

        fixture({
            object: typeorm,
            method: 'update',
            args: [userId, updateDto],
            return: { affected: 1 }
        })

        const recv = await repository.update(userId, updateDto)

        expect(recv).toBeTruthy()
    })
})

// import { AuthRepository } from '../../auth.repository'
import { IAuthRepository } from '../interfaces'
import { CreateAuthService } from './create-auth.service'

describe('CreateAuthService', () => {
    const userId = 'userId#1'
    const email = 'user@mail.com'
    const password = 'testpass'
    const auth = { userId, email }

    it('create', async () => {
        const createAuthDto = { userId, email, password }

        const repository = {
            findOne: jest.fn(() => null),
            create: jest.fn(() => auth)
        } as any as IAuthRepository

        const service = new CreateAuthService(repository)

        const recv = await service.exec(createAuthDto)

        expect(recv).toMatchObject(auth)
    })
})

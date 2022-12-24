import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { Authentication } from './domain'

describe('AuthController', () => {
    let controller: AuthController

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController]
        }).compile()

        controller = module.get(AuthController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    const userId = 'uuid#1'
    const email = 'user@mail.com'

    const auth = { userId, email } as Authentication

    it('login', async () => {
        const req = {
            user: {
                id: userId,
                email
            }
        }

        const recv = await controller.login(req)

        expect(recv).toMatchObject(auth)
    })

    it('logout', async () => {
        const logout = jest.fn().mockImplementation(() => {})

        const req = { logout }

        const recv = await controller.logout(req)

        expect(recv).toEqual({})
        expect(logout).toBeCalled()
    })
})

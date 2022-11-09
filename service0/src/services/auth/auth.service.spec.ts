import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { CreateAuthService, ValidateService } from './domain'

jest.mock('./auth.repository')
jest.mock('./domain/services')

describe('AuthService', () => {
    let service: AuthService
    let repository: AuthRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthService, AuthRepository]
        }).compile()

        service = module.get(AuthService)
        repository = module.get(AuthRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('compare hash with salt 나중에 옮겨야지', async () => {
        const saltOrRounds = 3
        const password = 'random_password'
        const hash = await bcrypt.hash(password, saltOrRounds)

        const isMatch = await bcrypt.compare(password, hash)

        expect(isMatch).toBeTruthy()
    })

    const userId = 'userId#1'
    const email = 'user@mail.com'
    const password = 'testpass'
    const auth = { userId, email }
    // hash는 snapshot 찍듯이 출력된 로그에서 가져왔다.
    // 런타임에 hash를 계산하면 테스트 코드가 복잡해지고 전체적으로 손해다.
    const hash = '$2b$07$s0zNhq.4kOUUp/MkQbDT2Omip4Xacqz3azlMS9DO7pP7K5499nkwG'

    it('create', async () => {
        const createAuthDto = { userId, email, password }

        fixture({
            object: repository,
            method: 'findOne',
            args: [{ email }],
            return: null
        })

        fixture({
            object: CreateAuthService.prototype,
            method: 'exec',
            args: [createAuthDto],
            return: auth
        })

        const recv = await service.create(createAuthDto)

        expect(recv).toMatchObject(auth)
    })

    it('validate', async () => {
        fixture({
            object: ValidateService.prototype,
            method: 'exec',
            args: [userId, password],
            return: { userId, email, passwordHash: hash }
        })

        const actual = await service.validate(userId, password)

        expect(actual).toBeTruthy()
    })

    it('remove', async () => {
        fixture({
            object: repository,
            method: 'remove',
            args: [userId],
            return: true
        })

        const promise = service.remove(userId)

        expect(promise).resolves.not.toThrow()
    })

    it('remove:fail', async () => {
        fixture({
            object: repository,
            method: 'remove',
            args: ['wrong'],
            return: false
        })

        const promise = service.remove('wrong')

        expect(promise).rejects.toThrow()
    })

    it('findOne:userId', async () => {
        fixture({
            object: repository,
            method: 'findOne',
            args: [{ userId }],
            return: auth
        })

        const recv = await service.findOne({ userId })

        expect(recv).toMatchObject(auth)
    })

    it('findOne:email', async () => {
        fixture({
            object: repository,
            method: 'findOne',
            args: [{ email }],
            return: auth
        })

        const recv = await service.findOne({ email })

        expect(recv).toMatchObject(auth)
    })
})

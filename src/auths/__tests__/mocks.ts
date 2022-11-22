import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global.module'
import { AuthsModule } from '../auths.module'
import { CreateAuthDto } from '../auths.service'

export const member = {
    createDto: {
        userId: 'memberId#1',
        role: 'member',
        email: 'member@mail.com',
        password: '1234'
    } as CreateAuthDto,
    loginDto: {
        email: 'member@mail.com',
        password: '1234'
    }
}

export const admin = {
    createDto: {
        userId: 'adminId#1',
        role: 'admin',
        email: 'admin@mail.com',
        password: 'abcd'
    } as CreateAuthDto,
    loginDto: {
        email: 'admin@mail.com',
        password: 'abcd'
    }
}

export async function createAuthsTestingModule() {
    return Test.createTestingModule({
        imports: [GlobalModule, AuthsModule]
    }).compile()
}

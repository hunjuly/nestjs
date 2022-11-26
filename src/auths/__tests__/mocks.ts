import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global.module'
import { AuthsModule } from '../auths.module'
import { CreateAuthDto } from '../auths.service'

export const member = {
    createDto: {
        userId: 'memberA',
        role: 'member',
        email: 'memberA@mail.com',
        password: '1234'
    } as CreateAuthDto,
    loginDto: {
        email: 'memberA@mail.com',
        password: '1234'
    },
    authCookie: null,
    userId: 'memberA'
}

export const admin = {
    createDto: {
        userId: 'adminA',
        role: 'admin',
        email: 'adminA@mail.com',
        password: '!@#$'
    } as CreateAuthDto,
    loginDto: {
        email: 'adminA@mail.com',
        password: '!@#$'
    },
    authCookie: null,
    userId: 'adminA'
}

export async function createAuthsTestingModule() {
    return Test.createTestingModule({
        imports: [GlobalModule, AuthsModule]
    }).compile()
}

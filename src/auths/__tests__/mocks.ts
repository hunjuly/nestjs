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

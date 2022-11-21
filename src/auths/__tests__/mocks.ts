import { CreateAuthDto } from '../auths.service'

export const memberDto = {
    userId: 'memberId#1',
    role: 'member',
    email: 'member@mail.com',
    password: '1234'
} as CreateAuthDto

export const adminDto = {
    userId: 'adminId#1',
    role: 'admin',
    email: 'admin@mail.com',
    password: 'abcd'
} as CreateAuthDto

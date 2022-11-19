import { UserRole } from '../domain'
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto'

export const createDto = {
    email: 'user@mail.com',
    username: 'user name',
    role: 'user' as UserRole,
    password: '1234'
}

export const updateDto = { email: 'new@mail.com', username: 'new name' }

export const firstDto = {
    email: 'A@mail.com',
    username: 'user',
    role: 'user',
    password: '1234'
}

export const secondDto = {
    email: 'B@mail.com',
    username: 'user',
    role: 'user',
    password: '1234'
}

export const createDtos = [
    { email: 'user1@mail.com', username: 'username', role: 'user' as UserRole, password: '1234' },
    { email: 'user2@mail.com', username: 'username', role: 'user' as UserRole, password: '1234' },
    { email: 'user3@mail.com', username: 'username', role: 'user' as UserRole, password: '1234' }
] as CreateUserDto[]

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchUserDto(expected): CustomMatcherResult
        }
    }
}

expect.extend({
    toMatchUserDto(user: UserDto, dto: CreateUserDto | UpdateUserDto) {
        const actually = {
            id: user.id,
            email: user.email,
            username: user.username,
            createDate: new Date(user.createDate),
            updateDate: new Date(user.updateDate)
        }

        const expected = expect.objectContaining({
            id: expect.any(String),
            email: dto.email,
            username: dto.username,
            createDate: expect.any(Date),
            updateDate: expect.any(Date)
        })

        const pass = this.equals(expected, actually)

        return {
            pass,
            message: () =>
                `expected ${this.utils.printReceived(
                    actually
                )} not to contain object ${this.utils.printExpected(expected)}`
        }
    }
})

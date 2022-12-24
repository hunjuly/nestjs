import { UpdateUserDto, User } from '..'

export type UserQuery = {
    email?: string
}

export interface IUsersRepository {
    create(candidate: User): Promise<User>
    findOne(query: UserQuery): Promise<User>
    update(userId: string, dto: UpdateUserDto): Promise<boolean>
    remove(userId: string): Promise<boolean>
    get(userId: string): Promise<User>
}

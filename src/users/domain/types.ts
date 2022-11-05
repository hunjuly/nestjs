export type UserRole = 'user' | 'admin'

export class CreateUserCmd {
    email: string
    username: string
    role: UserRole
}

export type UpdateUserCmd = Partial<CreateUserCmd>

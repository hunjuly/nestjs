export type UserRole = 'member' | 'admin'

export class CreateUserCmd {
    email: string
    username: string
    role: UserRole
}

export type UpdateUserCmd = Partial<CreateUserCmd>

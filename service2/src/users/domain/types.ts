export class CreateUserCmd {
    email: string
    username: string
}

export type UpdateUserCmd = Partial<CreateUserCmd>

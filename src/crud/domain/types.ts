export class CreateCrudCmd {
    name: string
}

export type UpdateCrudCmd = Partial<CreateCrudCmd>

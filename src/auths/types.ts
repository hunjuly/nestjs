import { UserRole } from 'src/users/domain'

export type SessionUser = {
    id: string
    email: string
    role: UserRole
}

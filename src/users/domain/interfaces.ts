import { IDomainRepository } from 'src/common/domain'
import { User } from './user'

export interface IUsersRepository extends IDomainRepository<User> {
    findByEmail(email: string): Promise<User | null>
}

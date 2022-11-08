import { IDomainRepository } from 'src/common/domain'
import { Crud } from './crud'

export interface ICrudsRepository extends IDomainRepository<Crud> {
    findByName(name: string): Promise<Crud | null>
}

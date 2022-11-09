import { Column, Entity } from 'typeorm'
import { BaseRecord } from 'src/common'

@Entity('Cruds')
export class CrudRecord extends BaseRecord {
    @Column({ unique: true })
    name: string
}

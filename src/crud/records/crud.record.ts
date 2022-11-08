import { Column, Entity } from 'typeorm'
import { Record } from 'src/common'

@Entity('Cruds')
export class CrudRecord extends Record {
    @Column({ unique: true })
    name: string
}

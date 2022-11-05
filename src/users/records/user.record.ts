import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn
} from 'typeorm'
import { UserRole } from '../domain'

@Entity('Users')
export class UserRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    username: string

    @Column()
    role: UserRole

    @CreateDateColumn()
    createDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @VersionColumn()
    version: number
}

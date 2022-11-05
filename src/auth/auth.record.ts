import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from 'src/users/domain'

@Entity()
export class AuthRecord {
    @PrimaryColumn()
    userId: string

    @Column({ unique: true })
    email: string

    @Column()
    role: UserRole

    @Column()
    passwordHash: string

    @UpdateDateColumn()
    updateDate: Date
}

import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class AuthRecord {
    @PrimaryColumn()
    userId: string

    @Column({ unique: true })
    email: string

    @Column()
    passwordHash: string

    @UpdateDateColumn()
    updateDate: Date
}

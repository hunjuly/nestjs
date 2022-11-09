import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    category: string

    @Column({ nullable: false })
    originalName: string

    @Column({ nullable: false })
    mimeType: string

    @Column({ nullable: false })
    size: number

    downloadUrl: string
}

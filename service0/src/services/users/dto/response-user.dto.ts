import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../domain'

const keys = ['id', 'email', 'isActive', 'role', 'createDate', 'updateDate', 'version'] as (keyof User)[]

export class ResponseUserDto extends PickType(User, keys) {
    @ApiProperty()
    url: string

    constructor(user: User) {
        super()

        this.url = `/users/${user.id}`

        keys.forEach((key: never) => {
            this[key] = user[key]
        })
    }
}

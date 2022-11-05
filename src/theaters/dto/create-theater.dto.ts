import { IsNotEmpty } from 'class-validator'

export class CreateTheaterDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    location: string
}

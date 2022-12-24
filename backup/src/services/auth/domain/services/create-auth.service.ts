import * as bcrypt from 'bcrypt'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { Authentication, IAuthRepository } from '..'

export class CreateAuthDto {
    @IsNotEmpty()
    userId: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}

export class CreateAuthService {
    constructor(private readonly repository: IAuthRepository) {}

    async exec(dto: CreateAuthDto) {
        const user = await this.repository.findOne({ email: dto.email })

        Assert.null(user, 'already exists authentication')

        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hash = await bcrypt.hash(dto.password, saltOrRounds)

        const candidate = new Authentication()
        candidate.userId = dto.userId
        candidate.email = dto.email
        candidate.passwordHash = hash

        const newUser = await this.repository.create(candidate)
        const { passwordHash, ...value } = newUser

        notUsed(passwordHash)

        return value
    }
}

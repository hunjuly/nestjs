import * as bcrypt from 'bcrypt'
import { IAuthRepository } from '..'

export class ValidateService {
    constructor(private readonly repository: IAuthRepository) {}

    async exec(userId: string, password: string) {
        const auth = await this.repository.findOne({ userId })

        Expect.found(auth)

        return bcrypt.compare(password, auth.passwordHash)
    }
}

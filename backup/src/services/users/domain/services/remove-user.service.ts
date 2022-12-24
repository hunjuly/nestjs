import { IUsersRepository } from '../interfaces'

export class RemoveUserService {
    constructor(private readonly repository: IUsersRepository) {}

    async exec(userId: string) {
        const user = await this.repository.get(userId)

        Expect.found(user)

        const success = await this.repository.remove(userId)

        Assert.truthy(success, `${userId} remove failed.`)
    }
}

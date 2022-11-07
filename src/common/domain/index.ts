export class AggregateRoot<T> {
    constructor(protected readonly repository: IDomainRepository<T>, public readonly id: string) {}

    async update(): Promise<T> {
        // TODO not good codes.
        const success = await this.repository.update(this.id, this as unknown as T)

        if (!success) throw new NotFoundDomainException()

        const crud = await this.repository.findById(this.id)

        return crud
    }

    async remove() {
        const success = await this.repository.remove(this.id)

        if (!success) throw new NotFoundDomainException()

        return { id: this.id }
    }
}

export interface IDomainRepository<T> {
    create(crud: Partial<T>): Promise<T | null>
    update(id: string, crud: Partial<T>): Promise<boolean>
    remove(id: string): Promise<boolean>
    findById(id: string): Promise<T | null>
    findAll(): Promise<T[]>
}

export class EventHandler {}

export class IEventEmmit {}

export class DomainException extends Error {}

export class AlreadyExistsDomainException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

export class NotFoundDomainException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

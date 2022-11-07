export interface IDomainRepository<T> {
    create(crud: Partial<T>): Promise<T | null>
    update<T>(id: string, crud: T): Promise<boolean>
    remove(id: string): Promise<boolean>
    findById(id: string): Promise<T | null>
    findAll(): Promise<T[]>
}

export class AggregateRoot {
    constructor(public readonly id: string) {}
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

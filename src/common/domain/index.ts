/**
 * 사용자를 만드는 것이다. 저장소 입장에서는 crud가 와야 한다.
 * 옵션에 따라서 crud를 만드는 것은 이전 단계에서 이루어 진다.
 * 그러니 여기에 command가 오면 안 된다.
 * 만들거나 업데이트는 완전한 Crud가 아니기 때문에 Partial이 자연스럽다.
 */
export interface IDomainRepository<T> {
    create(entity: Partial<T>): Promise<T | null>
    update(id: string, entity: Partial<T>): Promise<boolean>
    remove(id: string): Promise<boolean>
    findById(id: string): Promise<T | null>
    findAll(): Promise<T[]>
}

export abstract class AggregateRoot {
    constructor(public readonly id: string) {}
}

export class DomainException extends Error {
    constructor(message?: string) {
        super(message ?? '')
    }
}

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

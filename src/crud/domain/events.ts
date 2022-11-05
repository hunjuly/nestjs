export class DomainEvent {
    constructor(public readonly name: string) {}
}

export class CrudCreatedEvent extends DomainEvent {
    constructor(public readonly crudId: string, public readonly payload: any) {
        super('crud.created')
    }
}

export class CrudUpdatedEvent extends DomainEvent {
    constructor(public readonly crudId: string, public readonly payload: any) {
        super('crud.updated')
    }
}

export interface ICrudEventEmitter {
    emitEvent(event: CrudCreatedEvent | CrudUpdatedEvent)
}

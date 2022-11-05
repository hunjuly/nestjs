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

export class CrudEventHandler {
    handleCrudCreatedEvent(event: CrudCreatedEvent) {
        console.log('handleCrudCreatedEvent', event.crudId)
    }

    handleCrudUpdatedEvent(event: CrudUpdatedEvent) {
        console.log('handleCrudUpdatedEvent', event.crudId)
    }
}

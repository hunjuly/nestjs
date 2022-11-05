export class DomainException extends Error {}

export class AlreadyExistsCrudException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

export class NotFoundCrudException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

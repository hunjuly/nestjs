export class DomainException extends Error {}

export class AlreadyExistsUserException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

export class NotFoundUserException extends DomainException {
    constructor(message?: string) {
        super(message ?? '')
    }
}

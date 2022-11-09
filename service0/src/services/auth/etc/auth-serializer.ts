import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

class Payload {
    id: string
}

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor() {
        super()
    }
    serializeUser(user: Payload, done: (err: Error, user: Payload) => void) {
        done(null, user)
    }

    deserializeUser(payload: Payload, done: (err: Error, user: Payload) => void) {
        done(null, payload)
    }
}

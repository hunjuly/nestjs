import { Logger } from '@nestjs/common'

export class SystemError extends Error {}

// Unexpected System Errors. should be stop all systems.
export class Assert {
    static fail(message: string) {
        throw new SystemError(message)
    }

    static truthy(con: boolean, message: string) {
        if (!con) throw new SystemError(message)
    }

    static null(con: any, message: string) {
        if (con) throw new SystemError(message)
    }

    static exists(con: any, message: string) {
        if (!con) throw new SystemError(message)
    }

    static unique(con: any[] | { affected?: number }, message: string) {
        if (Array.isArray(con)) {
            if (1 < con.length) throw new SystemError(message)
        } else if (con.affected) {
            if (1 < con.affected) throw new SystemError(message)
        } else {
            Logger.verbose('DB does not support affected property.')
        }
    }
}

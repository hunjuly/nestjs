import { Logger } from '@nestjs/common'

export class SystemException extends Error {}

// Unexpected System Errors. should be stop all systems.
export class Assert {
    static fail(message?: string) {
        throw new SystemException(message)
    }

    static truthy(con: boolean, message?: string) {
        if (!con) throw new SystemException(message)
    }

    static null(con: any, message?: string) {
        if (con) throw new SystemException(message)
    }

    static exists(con: any, message?: string) {
        if (!con) throw new SystemException(message)
    }

    static unique(con: any[] | { affected?: number }, message?: string) {
        if (Array.isArray(con)) {
            if (1 < con.length) throw new SystemException(message)
        } else if (con.affected) {
            if (1 < con.affected) {
                const detail = JSON.stringify(con)

                throw new SystemException(message ? message + ', ' + detail : detail)
            }
        } else {
            Logger.verbose('DB does not support affected property.')
        }
    }
}

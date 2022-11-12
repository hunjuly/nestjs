import { Logger } from '@nestjs/common'

export class SystemError extends Error {}

// Unexpected System Errors. should be stop all systems.
export class Assert {
    static fail(message?: string) {
        throw new SystemError(message)
    }

    static truthy(con: boolean, message?: string) {
        if (!con) throw new SystemError(message)
    }

    static null(con: any, message?: string) {
        if (con) throw new SystemError(message)
    }

    static exists(con: any, message?: string) {
        if (!con) throw new SystemError(message)
    }

    static unique(con: any[] | UniqueResult, message?: string) {
        if (Array.isArray(con)) {
            if (1 < con.length) throw new SystemError(message)
        } else if (con.affected) {
            if (1 < con.affected) {
                const detail = JSON.stringify(con)

                throw new SystemError(message ? message + ', ' + detail : detail)
            }
        } else {
            Logger.verbose('DB does not support affected property.')
        }
    }
}

class UniqueResult {
    /**
     * Raw SQL result returned by executed query.
     */
    raw: any
    /**
     * Number of affected rows/documents
     * Not all drivers support this
     */
    affected?: number | null
}

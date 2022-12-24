import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

const format = winston.format

type LoggerOption = {
    storagePath: string
    storageDays: number
    fileLevel: string
    consoleLevel: string
    context: string
}

export function createLogger({ storagePath, storageDays, fileLevel, consoleLevel, context }: LoggerOption) {
    Path.mkdir(storagePath)

    const option = {
        dirname: storagePath,
        datePattern: 'YYYY-MM-DD, HH',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: storageDays + 'd',
        createSymlink: true,
        format: format.combine(format.timestamp({ format: 'HH:mm:ss.SSS' }), format.prettyPrint())
    }

    const all = new DailyRotateFile({
        ...option,
        symlinkName: `${context}-current.log`,
        filename: `${context}-%DATE%h.log`,
        level: fileLevel
    })

    const errors = new DailyRotateFile({
        ...option,
        datePattern: 'YYYY-MM-DD',
        maxFiles: null,
        symlinkName: `${context}-errors.log`,
        filename: `${context}-%DATE%, err.log`,
        level: 'error'
    })

    const console = new winston.transports.Console({
        format: format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: 'HH:mm:ss.SSS' }),
            format.simple()
        ),
        level: consoleLevel
    })

    const logger = winston.createLogger({
        format: format.json(),
        transports: [all, errors, console],
        exceptionHandlers: [errors]
    })

    return logger
}

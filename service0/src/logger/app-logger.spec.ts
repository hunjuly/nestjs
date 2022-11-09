import { Injectable, Logger } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as winston from 'winston'
import { AppLogger } from './app-logger'

@Injectable()
class LogService {
    private readonly logger = new Logger(LogService.name)

    constructor(private doNotUse: AppLogger) {}

    printLog() {
        this.logger.log('Instance Method')

        Logger.log('Static Method')

        this.doNotUse.log('Not Recommended Method.')
    }

    printError() {
        this.logger.error('error Instance Method')

        Logger.error('error Static Method')

        this.doNotUse.error('error Not Recommended Method.')
    }
}

it('create & using Logger', async () => {
    const module = await Test.createTestingModule({
        providers: [
            LogService,
            {
                provide: AppLogger,
                useFactory: () => {
                    const dev = new winston.transports.Console()

                    const logger = winston.createLogger({
                        transports: [dev]
                    })

                    return new AppLogger(logger)
                }
            }
        ]
    }).compile()

    module.useLogger(module.get(AppLogger))

    const service = module.get(LogService)

    service.printLog()
    service.printError()
})

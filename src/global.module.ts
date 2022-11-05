import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { createMemoryOrm } from './common'

@Module({
    imports: [createMemoryOrm(), EventEmitterModule.forRoot({ wildcard: true })],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class GlobalModule {}

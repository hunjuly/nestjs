import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AuthModule } from './auth'
import { createMemoryOrm } from './common'
import { UsersModule } from './users'

@Module({
    imports: [createMemoryOrm(), UsersModule, AuthModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class AppModule {}
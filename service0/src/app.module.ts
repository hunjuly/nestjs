import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { AuthModule } from 'src/services/auth/auth.module'
import { FilesModule } from 'src/services/files/files.module'
import { UsersModule } from 'src/services/users/users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { createConfigModule } from './create-config-module'
import { LoggerModule } from './logger'
import { createOrmModule } from './typeorm'

@Module({
    imports: [createOrmModule(), createConfigModule(), LoggerModule, UsersModule, FilesModule, AuthModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class AppModule {}

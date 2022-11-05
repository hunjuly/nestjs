import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthModule } from './auth'
import { GlobalModule } from './global.module'
import { TheatersModule } from './theaters'
import { UsersModule } from './users'

@Module({
    imports: [GlobalModule, UsersModule, AuthModule, TheatersModule],
    controllers: [AppController]
})
export class AppModule {}

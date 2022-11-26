import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppService } from './app.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const appService = app.get(AppService)
    appService.subscribeToShutdown(() => app.close())

    await app.listen(3000)

    console.log(`Application running on port ${await app.getUrl()}`)
}
bootstrap()

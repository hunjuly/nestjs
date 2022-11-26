import { INestApplication } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppService } from 'src/app.service'
import { SystemException } from 'src/common'
import { TestRequest, createApp, createRequest } from 'src/common/jest'

describe('main', () => {
    let app: INestApplication
    let req: TestRequest

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [TestController]
        }).compile()

        app = await createApp(module)
        req = createRequest(app, '/test')
    })

    afterEach(async () => {
        await app.close()
    })

    it('catch SytemException & shutdown', async () => {
        const appService = app.get(AppService)
        appService.subscribeToShutdown(() => {})

        const spy = jest.spyOn(appService, 'subscribeToShutdown')

        await req.get()

        expect(spy).toBeCalled()
    })
})

@Controller('test')
class TestController {
    @Get()
    test() {
        throw new SystemException('test message')
    }
}

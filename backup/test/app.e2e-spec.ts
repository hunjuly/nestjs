import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeApp, createApp } from './common'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect({ message: 'Hello World!' })
    })
})

import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeApp, createApp, get } from './common'

describe('File Upload(e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    async function uploadFile() {
        // package.json은 테스트와 무관한 상위 폴더에 존재한다.
        // 테스트 파일을 종류별로 따로 만들어라.
        return request(app.getHttpServer())
            .post('/files')
            .attach('marketfile', './package.json')
            .field('fieldName', 'test')
    }

    // curl -i -X POST -H "Content-Type: multipart/form-data" -F "marketfile=@package.json" -F "fieldName=abcd" "http://localhost:4000/files/upload/"
    it('/files (POST)', async () => {
        const res = await uploadFile()

        const expected = expect.objectContaining({
            id: expect.any(String),
            category: 'test',
            originalName: 'package.json',
            mimeType: 'application/json'
        })

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(expected)
    })

    it('/files/:id (GET)', async () => {
        const createRes = await uploadFile()

        const entity = createRes.body as { id: string }

        const res = await get(app, `/files/${entity.id}`)

        const expected = expect.objectContaining({
            id: entity.id,
            originalName: 'package.json',
            downloadUrl: expect.any(String)
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expected)
    })

    // curl "http://localhost:4000/files/"
    it('/files (GET)', async () => {
        await uploadFile()
        await uploadFile()

        const res = await get(app, '/files')

        const expected = expect.objectContaining({ id: expect.any(String) })

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
        expect(res.body[0]).toEqual(expected)
        expect(res.body[1]).toEqual(expected)
    })
})

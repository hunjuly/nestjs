import { CanActivate, ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, UserGuard } from 'src/auth'
import { createMemoryOrm } from 'src/common'
import { CreateTheaterDto } from '../dto/create-theater.dto'
import { TheaterDto } from '../dto/theater.dto'
import { UpdateTheaterDto } from '../dto/update-theater.dto'
import { TheatersModule } from '../theaters.module'
import { TheatersService } from '../theaters.service'

class MockAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}

describe('/theaters', () => {
    let app: INestApplication
    let service: TheatersService

    const createDto = {
        name: 'theater name',
        location: 'longitute'
    }

    const request = () => supertest(app.getHttpServer())
    const createTheater = (dto: CreateTheaterDto) => request().post('/theaters').send(dto)
    const findAllTheaters = () => request().get('/theaters')
    const findTheater = (theaterId: string) => request().get('/theaters/' + theaterId)
    const deleteTheater = (theaterId: string) => request().delete('/theaters/' + theaterId)

    const updateTheater = (theaterId: string, dto: UpdateTheaterDto) =>
        request()
            .patch('/theaters/' + theaterId)
            .send(dto)

    const expectTheaterDto = (theater: TheaterDto, dto: CreateTheaterDto | UpdateTheaterDto) => {
        const received = {
            id: theater.id,
            name: theater.name,
            location: theater.location
        }

        const expected = expect.objectContaining({
            id: expect.any(String),
            name: dto.name,
            location: dto.location
        })

        expect(received).toEqual(expected)
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TheatersModule, createMemoryOrm()]
        })
            .overrideGuard(UserGuard)
            .useClass(MockAuthGuard)
            .overrideGuard(AdminGuard)
            .useClass(MockAuthGuard)
            .compile()

        app = module.createNestApplication()
        await app.init()

        service = module.get(TheatersService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(app).toBeDefined()
        expect(service).toBeDefined()
    })

    // it('/ (POST), create a theater', async () => {
    //     const create = await createTheater(createDto)

    //     expect(create.status).toEqual(HttpStatus.CREATED)
    //     expectTheaterDto(create.body, createDto)
    // })

    // it('create a theater, but already exists', async () => {
    //     const success = await createTheater(createDto)
    //     expect(success.status).toEqual(HttpStatus.CREATED)

    //     const fail = await createTheater(createDto)
    //     expect(fail.status).toEqual(HttpStatus.CONFLICT)
    // })

    // it('/ (GET), find all theaters', async () => {
    //     // create theaters
    //     await createTheater({ email: 'theater1@mail.com', theatername: 'theatername', role: 'theater', password: '1234' })
    //     await createTheater({ email: 'theater2@mail.com', theatername: 'theatername', role: 'theater', password: '1234' })
    //     await createTheater({ email: 'theater3@mail.com', theatername: 'theatername', role: 'theater', password: '1234' })

    //     // find all
    //     const find = await findAllTheaters()
    //     const theaters = find.body

    //     // verify
    //     expect(find.status).toEqual(HttpStatus.OK)
    //     expect(theaters.length).toEqual(3)
    //     expect(theaters[0].email).toEqual('theater1@mail.com')
    //     expect(theaters[1].email).toEqual('theater2@mail.com')
    //     expect(theaters[2].email).toEqual('theater3@mail.com')
    // })

    // it('/:theaterId (GET), find a theater', async () => {
    //     // create a theater
    //     const { body } = await createTheater(createDto)

    //     // find the theater
    //     const find = await findTheater(body.id)

    //     // verify
    //     expect(find.status).toEqual(HttpStatus.OK)
    //     expectTheaterDto(find.body, createDto)
    // })

    // it('find a theater, but not found', async () => {
    //     const find = await findTheater('unknown-id')

    //     expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    // })

    // it('/:theaterId (PATCH), udpate a theater', async () => {
    //     // create
    //     const create = await createTheater(createDto)
    //     const theater = create.body

    //     // update the theater
    //     const updateDto = { email: 'new@mail.com', theatername: 'new name' }
    //     const update = await updateTheater(theater.id, updateDto)
    //     expect(update.status).toEqual(HttpStatus.OK)
    //     expectTheaterDto(update.body, updateDto)

    //     // find the theater
    //     const find = await findTheater(theater.id)
    //     expect(find.body).toMatchObject(updateDto)
    // })

    // it('udpate a theater, but not found', async () => {
    //     const update = await updateTheater('unknown-id', {})

    //     expect(update.status).toEqual(HttpStatus.NOT_FOUND)
    // })

    // it('udpate a theater,  but already exists email', async () => {
    //     // create A
    //     const createA = await createTheater({
    //         email: 'A@mail.com',
    //         theatername: 'theater',
    //         role: 'theater',
    //         password: '1234'
    //     })
    //     const theaterA = createA.body

    //     // create B@mail.com
    //     await createTheater({
    //         email: 'B@mail.com',
    //         theatername: 'theater',
    //         role: 'theater',
    //         password: '1234'
    //     })

    //     // update A, but already exists email
    //     const res = await updateTheater(theaterA.id, { email: 'B@mail.com', theatername: 'theater' })

    //     expect(res.status).toEqual(HttpStatus.CONFLICT)
    // })

    // it('/:theaterId (DELETE), remove a theater', async () => {
    //     // create a theater
    //     const create = await createTheater(createDto)
    //     const theater = create.body

    //     // delete the theater
    //     const delete_ = await deleteTheater(theater.id)
    //     expect(delete_.status).toEqual(HttpStatus.OK)
    //     expect(delete_.body).toEqual({ id: theater.id })

    //     // find the deleted theater
    //     const find = await findTheater(theater.id)
    //     expect(find.status).toEqual(HttpStatus.NOT_FOUND)
    // })

    // it('remove a theater, but not found', async () => {
    //     const delete_ = await deleteTheater('unknown-id')

    //     expect(delete_.status).toEqual(HttpStatus.NOT_FOUND)
    // })
})

import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateFileDto } from './dto/create-file.dto'
import { File } from './entities/file.entity'
import { FilesService } from './files.service'

describe('FilesService', () => {
    let service: FilesService

    beforeEach(async () => {
        const module = await createTestingModule()

        service = module.get(FilesService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})

function createTestingModule() {
    return Test.createTestingModule({
        providers: [
            FilesService,
            {
                provide: getRepositoryToken(File),
                useValue: {
                    find: jest.fn().mockResolvedValue(userArray),
                    findOne: jest
                        .fn()
                        .mockImplementation((id: string) => Promise.resolve({ ...oneUser, id })),
                    save: jest
                        .fn()
                        .mockImplementation((user: CreateFileDto) =>
                            Promise.resolve({ id: 'uuid#1', ...user })
                        ),
                    delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 }))
                }
            }
        ]
    }).compile()
}

const userArray = [
    {
        id: 'uuid#1',
        email: 'user1@test.com',
        password: 'pass#001'
    },
    {
        id: 'uuid#2',
        email: 'user2@test.com',
        password: 'pass#001'
    }
]

const oneUser = {
    id: 'uuid#1',
    email: 'user1@test.com',
    password: 'pass#001'
}

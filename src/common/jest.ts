export function createSpy(object: any, method: string, args: any[] | undefined | null, response: any) {
    return jest.spyOn(object, method).mockImplementation(async (...recv) => {
        if (args) {
            expect(recv).toEqual(args)
        }

        return response
    })
}

export function createTypeOrmMock() {
    return {
        findOneBy: jest.fn(),
        findAndCount: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    }
}

export const OrmMock = {
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    update: jest.fn()
}

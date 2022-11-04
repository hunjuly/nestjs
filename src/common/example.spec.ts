it('exception async', async () => {
    const asyncFunc = async () => {
        throw new Error('exception async')
    }

    const promise = asyncFunc()

    await expect(promise).rejects.toThrow(Error)
})

it('exception sync', async () => {
    const syncFunc = () => {
        throw new Error('exception sync')
    }

    const call = () => syncFunc()

    expect(call).toThrow(Error)
})

test('toEqual vs toMatchObject', () => {
    const received = {
        a: 1,
        b: 2
    }
    const expected = {
        a: 1
    }

    expect(received).not.toEqual(expected)
    expect(received).toMatchObject(expected)
})

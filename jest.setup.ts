import 'jest'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchArray(expected): CustomMatcherResult
        }
    }
}

expect.extend({
    toMatchArray(actualList: any[], expectedList: any[]) {
        const fail = (a: any[], b: any[]) => ({
            pass: false,
            message: () =>
                `expected ${this.utils.printReceived(a)} not to contain object ${this.utils.printExpected(b)}`
        })

        for (const expected of expectedList) {
            const pass = this.equals(actualList, expect.arrayContaining([expect.objectContaining(expected)]))

            if (!pass) {
                return fail(actualList, expectedList)
            }
        }

        for (const actual of actualList) {
            const pass = this.equals(expectedList, expect.arrayContaining([expect.objectContaining(actual)]))

            if (!pass) {
                return fail(expectedList, actualList)
            }
        }

        return { pass: true, message: () => 'success' }
    }
})

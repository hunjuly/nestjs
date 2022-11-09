import 'src/@global'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchArray(expected): CustomMatcherResult
        }
    }
    function fixture(opt: FixtureDefine): void
}

const g = global as any
type FixtureDefine = { object: any; method: string; args?: any[]; return?: any }

/**
 * mock의 spy와 stub 기능 구현을 간단하게 표현함
 */
g.fixture = (opt: FixtureDefine) => {
    jest.spyOn(opt.object, opt.method).mockImplementation(async (...args) => {
        if (opt.args) {
            expect(args).toEqual(opt.args)
        }

        if (opt.return) return opt.return
    })
}

expect.extend({
    toMatchArray(actual: any[], expectedList: any[]) {
        let pass = true

        for (const expected of expectedList) {
            pass = this.equals(actual, expect.arrayContaining([expect.objectContaining(expected)]))

            if (!pass) break
        }

        return {
            pass,
            message: () =>
                `expected ${this.utils.printReceived(
                    actual
                )} not to contain object ${this.utils.printExpected(expectedList)}`
        }
    }
})

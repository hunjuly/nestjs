import './Path_'
import './assert'

declare global {
    function notUsed(...args): void
}

const g = global as any

g.notUsed = (..._args) => {}

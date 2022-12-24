import { randomBytes } from 'crypto'
import { File } from './File'

export * from './File'

export function createUuid(): string {
    return randomBytes(16).toString('hex')
}

export async function sleep(timeout: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, timeout))
}

export function createChunk(size: number): string {
    const chunk = Buffer.alloc(size, 'abcdefghijklmnopqrstuvwxyz1234567890')

    return chunk.toString()
}

type PackageInfo = {
    name: string
    version: string
    description: string
}

export function getPackageInfo() {
    const info = File.readJson<PackageInfo>('package.json')

    return info
}

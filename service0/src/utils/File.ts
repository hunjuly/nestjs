import * as fs from 'fs'
import { Readable, Writable } from 'stream'

export class File {
    public static readStream(path: string): Readable {
        return fs.createReadStream(path)
    }

    public static writeStream(path: string): Writable {
        return fs.createWriteStream(path)
    }

    public static read(path: string): Buffer {
        const buffer = fs.readFileSync(path)

        return buffer
    }

    public static readJson<T = unknown>(path: string): T {
        const buffer = this.read(path)
        const text = buffer.toString('utf8')

        return JSON.parse(text)
    }

    public static write(path: string, data: string | Buffer): void {
        fs.writeFileSync(path, data)
    }

    public static append(path: string, data: string | Buffer): void {
        fs.appendFileSync(path, data)
    }

    public static async createChunk(path: string, size: number): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const stream = File.writeStream(path)

                const chunk = Buffer.alloc(size, 'abcdefghijklmnopqrstuvwxyz1234567890')
                stream.end(chunk, () => {
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

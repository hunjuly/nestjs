/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as fs from 'fs'
import { tmpdir } from 'os'
import * as p from 'path'

declare global {
    const Path: {
        absolute(src: string): string
        join(...paths: string[]): string
        mkdir(path: string): void
        rmdir(path: string): void
        remkdir(path: string): void
        isDir(path: string): boolean
        copyDir(src: string, dest: string): void
        copy(src: string, dest: string): void
        exists(path: string): boolean
        copyable(src: string, dest: string): boolean
        tempdir(): string
        getDirs(src: string): string[]
        basename(path: string): string
        dirname(path: string): string
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any

class Path {
    public static absolute(src: string): string {
        return p.isAbsolute(src) ? src : p.resolve(src)
    }

    public static join(...paths: string[]): string {
        return p.join(...paths)
    }

    public static mkdir(path: string): void {
        fs.mkdirSync(path, { recursive: true })
    }

    public static rmdir(path: string): void {
        if (this.exists(path)) {
            fs.rmSync(path, { recursive: true })
        }
    }

    public static remkdir(path: string): void {
        this.rmdir(path)
        this.mkdir(path)
    }

    public static basename(path: string): string {
        return p.basename(path)
    }

    public static dirname(path: string): string {
        return p.dirname(path)
    }

    public static isDir(path: string): boolean {
        const stats = fs.statSync(path)

        return stats.isDirectory()
    }

    public static copyDir(src: string, dest: string): void {
        const stats = fs.statSync(src)

        if (stats.isDirectory()) {
            fs.mkdirSync(dest)

            const items = fs.readdirSync(src)

            for (const item of items) {
                this.copyDir(Path.join(src, item), Path.join(dest, item))
            }
        } else {
            fs.copyFileSync(src, dest)
        }
    }

    public static copy(src: string, dest: string): void {
        const stats = fs.statSync(src)

        if (stats.isDirectory()) {
            const items = fs.readdirSync(src)

            for (const item of items) {
                fs.copyFileSync(Path.join(src, item), Path.join(dest, item))
            }
        } else {
            fs.copyFileSync(src, dest)
        }
    }

    public static exists(path: string): boolean {
        return fs.existsSync(path)
    }

    public static copyable(src: string, dest: string): boolean {
        const stats = fs.statSync(src)

        if (stats.isDirectory()) {
            const items = fs.readdirSync(src)

            for (const item of items) {
                if (!this.copyable(Path.join(src, item), Path.join(dest, item))) {
                    return false
                }
            }
        } else if (this.exists(dest)) {
            return false
        }

        return true
    }

    public static getDirs(src: string): string[] {
        const res: string[] = []

        const items = fs.readdirSync(src)

        for (const item of items) {
            const itemPath = Path.join(src, item)

            if (Path.isDir(itemPath)) {
                res.push(item)
            }
        }

        return res
    }

    public static tempdir(): string {
        return fs.mkdtempSync(`${tmpdir()}${p.sep}`)
    }
}
g.Path = Path

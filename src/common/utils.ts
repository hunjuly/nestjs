import { TypeOrmModule } from '@nestjs/typeorm'

export async function sleep(timeout: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, timeout))
}

export function createMemoryOrm() {
    return TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        autoLoadEntities: true
    })
}

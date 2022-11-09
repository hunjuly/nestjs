import { DataSource } from 'typeorm'
import { createOptions } from './create-options'
// migrations
import { mig1658604911087 } from './migrations/1658604911087-mig'

const migrations = [mig1658604911087]

const option = createOptions()

export const AppDataSource = new DataSource({ ...option, migrations })

// await AppDataSource.runMigrations()
// undoLastMigration - Reverts last executed migration.
// await AppDataSource.undoLastMigration()
// showMigrations(): Promise<boolean>;

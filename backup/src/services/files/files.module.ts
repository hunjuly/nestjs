import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {}

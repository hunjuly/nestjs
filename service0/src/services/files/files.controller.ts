import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiExtraModels, PickType } from '@nestjs/swagger'
import { Express } from 'express'
import { diskStorage } from 'multer'
import { createUuid } from 'src/utils'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FilesService } from './files.service'

export class CreateFilePartialDto extends PickType(CreateFileDto, ['fieldName'] as const) {}

@Controller('files')
@ApiExtraModels(CreateFilePartialDto)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('marketfile', {
            storage: diskStorage({
                destination: Path.tempdir(),
                filename: (req, file, callback) => callback(null, `${createUuid()}.dat`)
            })
        })
    )
    @ApiConsumes('multipart/form-data')
    create(@Body() fields: CreateFilePartialDto, @UploadedFile() file: Express.Multer.File) {
        const dto = {
            originalName: file.originalname,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
            fieldName: fields.fieldName
        }

        return this.filesService.create(dto)
    }

    @Get()
    findAll() {
        return this.filesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.update(id, updateFileDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(id)
    }
}

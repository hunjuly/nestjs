import { Injectable } from '@nestjs/common'

// import { AuthService } from 'src/auth'
// import { Theater } from './domain'

// import { CreateTheaterDto, UpdateTheaterDto, TheaterDto } from './dto'
// import { TheatersRepository } from './theaters.repository'

@Injectable()
export class TheatersService {
    // constructor(private repository: TheatersRepository) {}
    // async create(createDto: CreateTheaterDto): Promise<TheaterDto> {
    //     const createCmd = { ...createDto }
    //     const theater = await Theater.create(this.repository, createCmd)
    //     await this.authService.create({
    //         theaterId: theater.id,
    //         email: theater.email,
    //         role: theater.role,
    //         password: createDto.password
    //     })
    //     return theaterToDto(theater)
    // }
    // async findAll(): Promise<TheaterDto[]> {
    //     const theaters = await this.repository.findAll()
    //     const dtos: TheaterDto[] = []
    //     theaters.forEach((theater) => {
    //         const dto = theaterToDto(theater)
    //         dtos.push(dto)
    //     })
    //     return dtos
    // }
    // async findById(id: string): Promise<TheaterDto> {
    //     const theater = await Theater.findById(this.repository, id)
    //     return theaterToDto(theater)
    // }
    // async update(id: string, updateDto: UpdateTheaterDto): Promise<TheaterDto> {
    //     const updateCmd = { ...updateDto }
    //     const theater = await Theater.update(this.repository, id, updateCmd)
    //     return theaterToDto(theater)
    // }
    // async remove(id: string) {
    //     await Theater.remove(this.repository, id)
    //     return { id }
    // }
}

// function theaterToDto(theater: Theater): TheaterDto {
//     return {
//         id: theater.id,
//         email: theater.email,
//         theatername: theater.theatername,
//         createDate: theater.createDate,
//         updateDate: theater.updateDate
//     }
// }

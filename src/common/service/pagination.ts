import { ExecutionContext, createParamDecorator } from '@nestjs/common'

// import { Type, applyDecorators } from '@nestjs/common'

export class PageOption {
    limit: number
    offset: number

    static DEFAULT_PAGE_LIMIT = 100
    static default = { limit: this.DEFAULT_PAGE_LIMIT, offset: 0 }
}

export const PageQuery = createParamDecorator(
    (data: unknown, context: ExecutionContext): PageOption => {
        const request = context.switchToHttp().getRequest()

        return {
            offset: parseInt(request.query.offset, 10) || 0,
            limit: parseInt(request.query.limit, 10) || PageOption.DEFAULT_PAGE_LIMIT
        }
    }
    // [
    //     (target: any, key: string) => {
    //         ApiQuery({
    //             name: 'offset',
    //             schema: { default: 0, type: 'number', minimum: 0 },
    //             required: false
    //         })(target, key, Object.getOwnPropertyDescriptor(target, key))
    //         ApiQuery({
    //             name: 'limit',
    //             schema: { default: Pagination.DEFAULT_PAGE_LIMIT, type: 'number', minimum: 1 },
    //             required: false
    //         })(target, key, Object.getOwnPropertyDescriptor(target, key))
    //     }
    // ]
)

export class PaginatedList<E> extends PageOption {
    total: number
    items: E[]
}

// export class PaginatedResponse {
//     @ApiProperty()
//     total: number

//     @ApiProperty()
//     limit: number

//     @ApiProperty()
//     offset: number

//     @ApiProperty()
//     items: any[]
// }

// export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
//     return applyDecorators(
//         ApiOkResponse({
//             schema: {
//                 title: `PaginatedResponseOf${model.name}`,
//                 allOf: [
//                     { $ref: getSchemaPath(PaginatedResponse) },
//                     {
//                         properties: {
//                             items: {
//                                 type: 'array',
//                                 items: { $ref: getSchemaPath(model) }
//                             }
//                         }
//                     }
//                 ]
//             }
//         })
//     )
// }

export class OrderOption {
    name: string
    direction: 'asc' | 'desc' | 'ASC' | 'DESC'
}

export const OrderQuery = createParamDecorator((data: unknown, context: ExecutionContext): OrderOption => {
    const request = context.switchToHttp().getRequest()

    if (request.query.orderby) {
        const items = request.query.orderby.split(':')

        if (items.length === 2) {
            return { name: items[0], direction: items[1] }
        }
    }

    return undefined
})

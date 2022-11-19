import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export class OrderOption {
    name: string
    direction: 'asc' | 'desc'
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

import { Crud } from './crud'

export interface ICrudsRepository {
    /**
     *사용자를 만드는 것이다. 저장소 입장에서는 crud가 와야 한다.
     *옵션에 따라서 crud를 만드는 것은 이전 단계에서 이루어 진다.
     그러니 여기에 command가 오면 안 된다.
     만들거나 업데이트는 완전한 Crud가 아니기 때문에 Partial이 자연스럽다.
     */
    create(crud: Partial<Crud>): Promise<Crud | null>
    update(id: string, crud: Partial<Crud>): Promise<boolean>
    remove(id: string): Promise<boolean>
    findById(id: string): Promise<Crud | null>
    findByName(name: string): Promise<Crud | null>
    findAll(): Promise<Crud[]>
}

import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'

// TODO 시스템 오류 시 어떻게 멈추나.
// https://stackoverflow.com/questions/57146395/how-to-trigger-application-shutdown-from-a-service-in-nest-js

@Injectable()
export class AppService {
    private shutdownListener: Subject<void> = new Subject()

    subscribeToShutdown(shutdownFn: () => void): void {
        this.shutdownListener.subscribe(() => shutdownFn())
    }

    shutdown() {
        this.shutdownListener.next()
    }
}

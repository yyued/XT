import { Window } from './Window'

export class ApplicationDelegate {
    window?: Window;
    applicationDidFinishLaunchingWithOptions(application: Application, launchOptions: Object): void { }
}

export class Application {
    constructor(t: any, delegate: ApplicationDelegate) { }
    readonly delegate: ApplicationDelegate
    readonly keyWindow?: Window
    static sharedApplication(): Application { throw "NOT IMPLEMENT!" }
}
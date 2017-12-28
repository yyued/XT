/// <reference path="xtr.d.ts" />
import { Window } from './Window'

let sharedApplication: Application | undefined = undefined;

export class ApplicationDelegate {

    objectRef: any

    public resetNativeObject(objectRef: any) {
        this.objectRef = objectRef;
    }

    public get window(): Window | undefined {
        const windowRef = XTRApplicationDelegate.xtr_window(this.objectRef)
        return objectRefs[windowRef] || new Window(windowRef)
    }

    public set window(value: Window | undefined) {
        if (value) {
            XTRApplicationDelegate.xtr_setWindowObjectRef(value.objectRef, this.objectRef)
        }
    }

    applicationDidFinishLaunchingWithOptions(application: Application, launchOptions: Object): void { }

}

export class Application {

    objectRef: any

    delegate: ApplicationDelegate

    public get keyWindow(): Window | undefined {
        const ref = XTRApplication.xtr_keyWindow(this.objectRef)
        return objectRefs[ref] || new Window(ref);
    }

    constructor(t: any, delegate: ApplicationDelegate) {
        if (sharedApplication === undefined) {
            sharedApplication = this;
        }
        this.objectRef = XTRApplication.create(this);
        objectRefs[this.objectRef] = this;
        (window as any)._xtrDelegate = delegate;
        this.delegate = delegate;
    }

    static sharedApplication(): Application | undefined {
        return sharedApplication
    }

    exit(): void {
        XTRApplication.xtr_exit(this.objectRef);
    }

}
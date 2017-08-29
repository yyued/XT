/// <reference path="xtr.d.ts" />
import { View } from "./View";

export interface NavigationControllerInterface extends ViewController {
    pushViewController(viewController: ViewController, animated?: boolean): void
    popViewController(animated?: boolean): ViewController | undefined
    popToViewController(viewController: ViewController, animated?: boolean): ViewController[]
    popToRootViewController(animated?: boolean): ViewController[]
}

export class ViewController {

    nativeObject: any;

    constructor(nativeObject?: any, isChild: boolean = false) {
        if (isChild) { return; }
        if (nativeObject) {
            this.nativeObject = nativeObject;
        }
        else {
            this.nativeObject = XTRViewController.create(this);
            (window as any).objectCreater.store(this);
        }
    }

    public get view() {
        return this.nativeObject.xtr_view();
    }

    public set view(value: View) {
        this.nativeObject.xtr_setView(value);
        (this as any).viewRef = value;
    }

    loadView(): void {
        this.view = new View();
        this.view.userInteractionEnabled = true;
    }

    viewDidLoad(): void { }
    viewWillAppear(): void { }
    viewDidAppear(): void { }
    viewWillDisappear(): void { }
    viewDidDisappear(): void { }
    viewWillLayoutSubviews(): void { }
    viewDidLayoutSubviews(): void { }

    public get parentViewController(): ViewController | undefined {
        return this.nativeObject.xtr_parentViewController();
    }

    public get childViewControllers(): ViewController[] {
        return this.nativeObject.xtr_childViewControllers();
    }

    addChildViewController(childController: ViewController): void {
        this.nativeObject.xtr_addChildViewController(childController);
    }

    removeFromParentViewController(): void {
        this.nativeObject.xtr_removeFromParentViewController();
    }

    willMoveToParentViewController(parent?: ViewController): void { }
    didMoveToParentViewController(parent?: ViewController): void { }

    public get navigationController(): NavigationControllerInterface | undefined {
        return this.nativeObject.xtr_navigationController();
    }

}

if ((window as any).objectClasses === undefined) {
    (window as any).objectClasses = [];
}
(window as any).objectClasses.push((target: any) => {
    if (target.constructor.toString() === "[object XTRViewControllerConstructor]") {
        return new ViewController(target);
    }
    return undefined;
})
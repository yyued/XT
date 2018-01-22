
export class Alert {

    public buttonTitle: string = "好的"

    constructor(readonly message: string) { }

    show(callback?: () => void): void {
        XTRModal.showAlertCallback({ message: this.message, buttonTitle: this.buttonTitle }, callback)
    }

}

export class Confirm {

    public confirmTitle: string = "确认"
    public cancelTitle: string = "取消"

    constructor(readonly message: string) { }

    show(resolve: () => void, reject: () => void): void {
        XTRModal.showConfirmResolverRejecter({
            message: this.message,
            confirmTitle: this.confirmTitle,
            cancelTitle: this.cancelTitle,
        }, resolve, reject)
    }

}

export class Prompt {

    public placeholder: string

    public defaultValue: string

    public confirmTitle: string = "确认"

    public cancelTitle: string = "取消"

    constructor(readonly message: string) { }

    show(resolve: (value: string) => void, reject: () => void): void {
        XTRModal.showPromptResolverRejecter({
            message: this.message,
            confirmTitle: this.confirmTitle,
            cancelTitle: this.cancelTitle,
            placeholder: this.placeholder,
            defaultValue: this.defaultValue,
        }, resolve, reject)
    }

}
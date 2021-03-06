declare var Proxy: any

export class BaseObject {

    [key: string]: any;

    public objectRef: string

    retain(owner: any = undefined): this {
        if (typeof this.objectRef === "string") {
            _XTRetain(this.objectRef, owner instanceof BaseObject ? owner : undefined)
        }
        return this
    }

    release(): this {
        if (typeof this.objectRef === "string") {
            _XTRelease(this.objectRef)
        }
        return this
    }

    constructor(objects: { [key: string]: any } | undefined = undefined, isBaseObject: boolean = true) {
        if (this.constructor === BaseObject && isBaseObject === true) {
            this.objectRef = _XTBaseObject.create()
            objectRefs[this.objectRef] = this
        }
        if (this.constructor instanceof XT.BaseArray) { return; }
        const proxy = new Proxy(this, {
            get: function (obj: any, prop: any) {
                const value = obj[prop]
                if (value instanceof BaseObject && typeof value.objectRef === "string" && !_XTValidObject(value.objectRef)) {
                    return undefined
                }
                return value;
            },
            set: function (obj: any, prop: any, value: any) {
                if (prop.indexOf("weak") < 0 && obj[prop] instanceof BaseObject) {
                    obj[prop].release()
                }
                obj[prop] = value
                if (prop.indexOf("weak") < 0 && value instanceof BaseObject && obj instanceof BaseObject) {
                    value.retain(obj)
                }
                return true
            }
        })
        if (objects) {
            for (const key in objects) {
                proxy[key] = objects[key]
            }
        }
        return proxy
    }

}
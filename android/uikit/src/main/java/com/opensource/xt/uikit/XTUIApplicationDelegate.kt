package com.opensource.xt.uikit

import com.eclipsesource.v8.V8Object
import com.opensource.xt.core.*

/**
 * Created by cuiminghui on 2017/8/31.
 */


class XTUIApplicationDelegate(val context: XTUIContext): XTComponentInstance {

    override var objectUUID: String? = null

    var window: XTUIWindow? = null

    fun scriptObject(): V8Object? {
        return context.evaluateScript("objectRefs['$objectUUID']") as? V8Object
    }

    fun didFinishLaunchWithOptions(options: Map<String, Any>) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "applicationDidFinishLaunchingWithOptions")
            it.release()
        }
    }

    class JSExports(val context: XTUIContext): XTComponentExport() {

        override val name: String = "_XTUIApplicationDelegate"

        override fun exports(): V8Object {
            val exports = V8Object(context.runtime)
            exports.registerJavaMethod(this, "create", "create", arrayOf())
            exports.registerJavaMethod(this, "xtr_window", "xtr_window", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setWindow", "xtr_setWindow", arrayOf(String::class.java, String::class.java))
            return exports
        }

        fun create(): String {
            val application = XTUIApplicationDelegate(context)
            val managedObject = XTManagedObject(application)
            application.objectUUID = managedObject.objectUUID
            XTMemoryManager.add(managedObject)
            XTMemoryManager.retain(managedObject.objectUUID)
            return managedObject.objectUUID
        }

        fun xtr_window(objectRef: String): String? {
            return (XTMemoryManager.find(objectRef) as? XTUIApplicationDelegate)?.window?.objectUUID
        }

        fun xtr_setWindow(windowRef: String, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIApplicationDelegate)?.window = XTMemoryManager.find(windowRef) as? XTUIWindow
        }

    }

}
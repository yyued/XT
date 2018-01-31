package com.opensource.xt.uikit

import android.os.Build
import android.support.v4.view.ViewCompat
import android.util.AttributeSet
import android.view.View
import android.view.Window
import com.eclipsesource.v8.V8Object
import com.opensource.xt.core.XTManagedObject
import com.opensource.xt.core.XTMemoryManager
import com.opensource.xt.core.XTComponentExport
import com.opensource.xt.core.XTComponentInstance
import java.lang.ref.WeakReference

/**
 * Created by cuiminghui on 2018/1/12.
 */
class XTUINavigationBar @JvmOverloads constructor(
        xtrContext: XTUIContext, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : XTUIView(xtrContext, attrs, defStyleAttr), XTComponentInstance {

    var window: WeakReference<Window>? = null
        set(value) {
            field = value
            resetStatusBar()
        }

    var lightContent: Boolean = false
        set(value) {
            field = value
            resetStatusBar()
        }

    override var backgroundColor: XTUIColor
        get() = super.backgroundColor
        set(value) {
            super.backgroundColor = value
            resetStatusBar()
        }

    fun resetStatusBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            window?.get()?.decorView?.systemUiVisibility = if (this.lightContent) 0 else View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            window?.get()?.statusBarColor = this.backgroundColor.intColor()
        }
    }

    class JSExports(val context: XTUIContext): XTComponentExport() {

        override val name: String = "_XTUINavigationBar"

        override fun exports(): V8Object {
            val exports = V8Object(context.runtime)
            exports.registerJavaMethod(this, "create", "create", arrayOf())
            exports.registerJavaMethod(this, "xtr_setLightContent", "xtr_setLightContent", arrayOf(Boolean::class.java, String::class.java))
            return exports
        }

        fun create(): String {
            val view = XTUINavigationBar(context)
            ViewCompat.setElevation(view, 4.0f)
            val managedObject = XTManagedObject(view)
            view.objectUUID = managedObject.objectUUID
            XTMemoryManager.add(managedObject)
            return managedObject.objectUUID
        }

        fun xtr_setLightContent(value: Boolean, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? XTUINavigationBar ?: return
            view.lightContent = value
        }
    }

}
package com.opensource.xt.uikit

import android.os.Build
import com.eclipsesource.v8.V8Object
import com.opensource.xt.core.XTCore
import com.opensource.xt.core.XTComponentExport

/**
 * Created by cuiminghui on 2017/9/28.
 */


class XTUIDevice {

    class JSExports(val context: XTUIContext): XTComponentExport() {

        override val name: String = "_XTUIDevice"

        override fun exports(): V8Object {
            val exports = V8Object(context.runtime)
            exports.registerJavaMethod(this, "xtr_deviceName", "xtr_deviceName", arrayOf())
            exports.registerJavaMethod(this, "xtr_systemName", "xtr_systemName", arrayOf())
            exports.registerJavaMethod(this, "xtr_systemVersion", "xtr_systemVersion", arrayOf())
            exports.registerJavaMethod(this, "xtr_model", "xtr_model", arrayOf())
            return exports
        }

        fun xtr_deviceName(): String {
            return Build.BRAND
        }

        fun xtr_systemName(): String {
            return "Android"
        }

        fun xtr_systemVersion(): String {
            return Build.VERSION.SDK_INT.toString()
        }

        fun xtr_model(): String {
            return Build.MODEL
        }

    }

}
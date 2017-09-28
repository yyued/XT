package com.opensource.xtruntime

import android.os.Build

/**
 * Created by cuiminghui on 2017/9/28.
 */
class XTRDevice: XTRComponent() {

    override val name: String = "XTRDevice"

    private var current: InnerObject? = null

    fun xtr_current(): InnerObject {
        if (current == null) {
            current = InnerObject(xtrContext)
        }
        return current ?: InnerObject(xtrContext)
    }

    class InnerObject(val xtrContext: XTRContext) {

        fun xtr_name(): String {
            return Build.BRAND
        }

        fun xtr_systemName(): String {
            return "Android"
        }

        fun xtr_systemVersion(): String {
            return Build.VERSION.SDK_INT.toString()
        }

        fun xtr_xtRuntimeVersion(): String {
            return XTRuntime.version
        }

        fun xtr_model(): String {
            return Build.MODEL
        }

        fun xtr_orientation(): Int {
            return 0
        }

    }

}
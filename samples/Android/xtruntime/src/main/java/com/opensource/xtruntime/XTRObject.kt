package com.opensource.xtruntime

import com.eclipsesource.v8.Releasable
import com.eclipsesource.v8.V8
import com.eclipsesource.v8.V8Object
import com.eclipsesource.v8.utils.MemoryManager
import java.util.*

/**
 * Created by cuiminghui on 2017/9/1.
 */
interface XTRObject {

    companion object {

        var tmpNativeObject: XTRObject? = null

        fun requestNativeObject(scriptObject: V8Object): XTRObject? {
            return try {
                tmpNativeObject = null
                val nativeObject = scriptObject.get("nativeObject")
                (nativeObject as? V8Object)?.let {
                    it.executeJSFunction("xtr_decodeObject")
                }
                (nativeObject as? Releasable)?.release()
                tmpNativeObject
            } catch (e: Exception) {
                null
            }
        }

    }

    val objectUUID: String
    var scriptObject: V8Object?

    fun requestV8Object(runtime: V8): V8Object {
        val v8Object = V8Object(runtime)
        v8Object.registerJavaMethod(this, "xtr_decodeObject", "xtr_decodeObject", arrayOf())
        v8Object.add("objectUUID", objectUUID)
        return v8Object
    }

    fun xtr_decodeObject() {
        tmpNativeObject = this
    }

}
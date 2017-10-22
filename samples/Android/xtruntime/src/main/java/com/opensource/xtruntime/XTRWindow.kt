package com.opensource.xtruntime

import android.content.Context
import android.graphics.Color
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.eclipsesource.v8.V8
import com.eclipsesource.v8.V8Function
import com.eclipsesource.v8.V8Object
import org.mozilla.javascript.ScriptableObject
import java.util.*

/**
 * Created by cuiminghui on 2017/8/31.
 */
class XTRWindow: XTRComponent() {

    companion object {

        var firstResponder: Any? = null

    }

    override val name: String = "XTRWindow"

    override fun v8Object(): V8Object? {
        val v8Object = V8Object(xtrContext.v8Runtime)
        v8Object.registerJavaMethod(this, "createScriptObject", "createScriptObject", arrayOf(V8Object::class.java, V8Object::class.java))
        return v8Object
    }

    fun createScriptObject(rect: V8Object, scriptObject: V8Object): V8Object {
        val view = InnerObject(scriptObject, xtrContext)
        XTRUtils.toRect(rect)?.let {
            view.frame = it
        }
        return view.requestV8Object(xtrContext.v8Runtime)
    }

    class InnerObject(scriptObject: V8Object, xtrContext: XTRContext): XTRView.InnerObject(scriptObject, xtrContext), XTRObject {

        override val objectUUID: String = UUID.randomUUID().toString()
        internal var appDelegate: XTRApplicationDelegate.InnerObject? = null

        init {
            xtr_setUserInteractionEnabled(true)
        }

        override fun requestV8Object(runtime: V8): V8Object {
            val v8Object = super<XTRView.InnerObject>.requestV8Object(runtime)
            v8Object.registerJavaMethod(this, "xtr_rootViewController", "xtr_rootViewController", arrayOf())
            v8Object.registerJavaMethod(this, "xtr_setRootViewController", "xtr_setRootViewController", arrayOf(V8Object::class.java))
            v8Object.registerJavaMethod(this, "xtr_makeKeyAndVisible", "xtr_makeKeyAndVisible", arrayOf())
            v8Object.registerJavaMethod(this, "xtr_setStatusBarHidden", "xtr_setStatusBarHidden", arrayOf(Boolean::class.java))
            v8Object.registerJavaMethod(this, "xtr_endEditing", "xtr_endEditing", arrayOf())

            return v8Object
        }

        internal var rootViewController: XTRViewController.InnerObject? = null
            set(value) {
                field?.let {
                    it.view?.xtr_removeFromSuperview()
                }
                field = value
                field?.let {
                    it.view?.let {
                        this.addSubview(it)
                        it.frame = this.bounds
                    }
                }
            }

        fun xtr_rootViewController(): Any? {
            return XTRUtils.fromObject(xtrContext, rootViewController)
        }

        fun xtr_setRootViewController(value: V8Object) {
            XTRUtils.toViewController(value)?.let {
                rootViewController = it
            }
        }

        fun xtr_makeKeyAndVisible() {
            appDelegate?.windowMakeKeyAndVisibleRunnable?.invoke()
        }

        fun keyboardWillShow(height: Int) {
            xtrContext.invokeMethod(scriptObject, "handleKeyboardShow", arrayOf(
                    XTRRect(0.0, 0.0, this.bounds.width, height.toDouble() / resources.displayMetrics.density),
                    0.15
            ))
        }

        fun keyboardWillHide() {
            xtrContext.invokeMethod(scriptObject, "handleKeyboardHide", arrayOf(
                    0.0
            ))
            firstResponder?.let {
                (it as? XTRTextField.InnerObject)?.xtr_blur()
                (it as? XTRTextView.InnerObject)?.xtr_blur()
            }
        }

        fun orientationChanged() {
            xtrContext.invokeMethod(scriptObject, "handleOrientationChange", arrayOf())
        }

        fun xtr_setStatusBarHidden(hidden: Boolean) {
            this.systemUiVisibility = if (hidden) View.SYSTEM_UI_FLAG_FULLSCREEN else 0
        }

        fun xtr_endEditing() {
            firstResponder?.let {
                (it as? XTRTextField.InnerObject)?.xtr_blur()
                (it as? XTRTextView.InnerObject)?.xtr_blur()
            }
        }

        override fun layoutSubviews() {
            super.layoutSubviews()
            rootViewController?.view?.frame = this.bounds
        }

        override fun onTouchEvent(event: MotionEvent?): Boolean {
            when (event?.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    val pid = event.getPointerId(0).toString()
                    val timestamp = System.nanoTime() / 1000000
                    val point = XTRPoint((event.x / resources.displayMetrics.density).toDouble(), (event.y / resources.displayMetrics.density).toDouble())
                    xtrContext.invokeMethod(scriptObject, "handlePointerDown", arrayOf(pid, timestamp, point))
                }
                MotionEvent.ACTION_MOVE -> {
                    val pid = event.getPointerId(0).toString()
                    val timestamp = System.nanoTime() / 1000000
                    val point = XTRPoint((event.x / resources.displayMetrics.density).toDouble(), (event.y / resources.displayMetrics.density).toDouble())
                    xtrContext.invokeMethod(scriptObject, "handlePointerMove", arrayOf(pid, timestamp, point))
                }
                MotionEvent.ACTION_UP -> {
                    val pid = event.getPointerId(0).toString()
                    val timestamp = System.nanoTime() / 1000000
                    val point = XTRPoint((event.x / resources.displayMetrics.density).toDouble(), (event.y / resources.displayMetrics.density).toDouble())
                    xtrContext.invokeMethod(scriptObject, "handlePointerUp", arrayOf(pid, timestamp, point))
                }
                MotionEvent.ACTION_POINTER_DOWN -> {
//                    val timestamp = System.nanoTime() / 1000000
//                    val pid = event.getPointerId(0)
//                    System.out.println("xxxxx" + pid)
                }
            }
            return true
        }

    }

}
package com.opensource.xt.uikit

import android.graphics.Color
import android.graphics.PorterDuff
import android.util.AttributeSet
import android.widget.Switch
import com.eclipsesource.v8.V8Object
import com.opensource.xt.core.*


/**
 * Created by cuiminghui on 2018/1/23.
 */
class XTUISwitch @JvmOverloads constructor(
        xtrContext: XTUIContext, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : XTUIView(xtrContext, attrs, defStyleAttr), XTComponentInstance {

    private val innerView = Switch(context)

    init {
        resetColor()
        innerView.setOnCheckedChangeListener { buttonView, isChecked ->
            resetColor()
            scriptObject()?.let {
                XTContext.invokeMethod(it, "handleValueChanged")
                XTContext.release(it)
            }
        }
        addView(innerView, LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT))
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        if (changed) {
            innerView.x = (((right - left) - innerView.width) / 2.0).toFloat()
            innerView.y = (((bottom - top) - innerView.height) / 2.0).toFloat()
        }
    }

    override fun tintColorDidChange() {
        super.tintColorDidChange()
        this.resetColor()
    }

    fun resetColor() {
        if (innerView.isChecked) {
            innerView.thumbDrawable.setColorFilter(this.tintColor?.intColor() ?: Color.BLACK, PorterDuff.Mode.MULTIPLY)
        }
        else {
            innerView.thumbDrawable.setColorFilter(Color.TRANSPARENT, PorterDuff.Mode.DST_OVER)
        }
    }

    class JSExports(context: XTUIContext): XTUIView.JSExports(context) {

        override val name: String = "_XTUISwitch"

        override val viewClass: Class<XTUIView> = XTUISwitch::class.java as Class<XTUIView>

        override fun exports(): V8Object {
            val exports = super.exports()
            exports.registerJavaMethod(this, "xtr_on", "xtr_on", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setOn", "xtr_setOn", arrayOf(Boolean::class.java, Boolean::class.java, String::class.java))
            return exports
        }

        fun xtr_on(objectRef: String): Boolean {
            return (XTMemoryManager.find(objectRef) as? XTUISwitch)?.innerView?.isChecked ?: false
        }

        fun xtr_setOn(value: Boolean, animated: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUISwitch)?.innerView?.isChecked = value
        }

    }

}
package com.opensource.xt.uikit

import android.graphics.*
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.widget.FrameLayout
import com.eclipsesource.v8.*
import com.opensource.xt.core.*
import java.lang.ref.WeakReference

open class XTUIView @JvmOverloads constructor(
        val xtrContext: XTUIContext, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : FrameLayout(xtrContext.appContext, attrs, defStyleAttr), XTComponentInstance {

    override var objectUUID: String? = null
    internal var viewDelegate: WeakReference<XTUIViewController>? = null

    fun scriptObject(): V8Object? {
        return xtrContext.evaluateScript("objectRefs['$objectUUID']") as? V8Object
    }

    init {
        clipChildren = false
        setWillNotDraw(false)
    }

    override fun setClipChildren(clipChildren: Boolean) {
        super.setClipChildren(clipChildren)
        invalidate()
    }

    override fun invalidate() {
        super.invalidate()
        if (android.os.Build.VERSION.SDK_INT < 18) {
            (parent as? View)?.let { it.invalidate() }
        }
    }

    var clipsToBounds = false
        set(value) {
            field = value
            resetPath()
            invalidate()
        }

    var frameChangeViaJavascript = false
        private set

    var frame: XTUIRect? = null
        set(value) {
            if (field?.equals(value) == true) {
                return
            }
            if (value != null && XTUIViewAnimator.animationEnabled) {
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.frame.x", (this.frame?.x ?: 0.0).toFloat() as Any, value.x.toFloat() as Any, { x ->
                    this.frame?.let {
                        this.frame = XTUIRect((x as Float).toDouble(), it.y, it.width, it.height)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.frame.y", (this.frame?.y ?: 0.0).toFloat() as Any, value.y.toFloat() as Any, { y ->
                    this.frame?.let {
                        this.frame = XTUIRect(it.x, (y as Float).toDouble(), it.width, it.height)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.frame.width", (this.frame?.width ?: 0.0).toFloat() as Any, value.width.toFloat() as Any, { width ->
                    this.frame?.let {
                        this.frame = XTUIRect(it.x, it.y, (width as Float).toDouble(), it.height)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.frame.height", (this.frame?.height ?: 0.0).toFloat() as Any, value.height.toFloat() as Any, { height ->
                    this.frame?.let {
                        this.frame = XTUIRect(it.x, it.y, it.width, (height as Float).toDouble())
                    }
                }))
                return
            }
            if (!this.frameChangeViaJavascript) {
                scriptObject()?.let {
                    XTContext.invokeMethod(it, "handleFrameChange")
                    XTContext.release(it)
                }
            }
            field = value
            this.bounds = XTUIRect(0.0, 0.0, frame?.width ?: (this.width / resources.displayMetrics.density).toDouble(), frame?.height ?: (this.height / resources.displayMetrics.density).toDouble())
            layoutSubviews()
            requestLayout()
        }

    var bounds: XTUIRect = XTUIRect(0.0, 0.0, frame?.width ?: (this.width / resources.displayMetrics.density).toDouble(), frame?.height ?: (this.height / resources.displayMetrics.density).toDouble())
        set(value) {
            field = value
            resetPath()
            invalidate()
        }

    override fun requestLayout() {
        if (isLayoutRequested) {
            return
        }
        super.requestLayout()
    }


    var transformMatrixChangeViaJavascript = false
        private set

    var transformMatrix: XTUIMatrix = XTUIMatrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
        set(value) {
            if (XTUIViewAnimator.animationEnabled) {
                val oldValue = transformMatrix.unMatrix()
                val newValue = value.unMatrix()
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.transform.scale.x", oldValue.scale.x.toFloat() as Any, newValue.scale.x.toFloat() as Any, { scaleX ->
                    transformMatrix = transformMatrix.setScale((scaleX as Float).toDouble(), null)
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.transform.scale.y", oldValue.scale.y.toFloat() as Any, newValue.scale.y.toFloat() as Any, { scaleY ->
                    transformMatrix = transformMatrix.setScale(null, (scaleY as Float).toDouble())
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.transform.rotate", oldValue.degree.toFloat() as Any, newValue.degree.toFloat() as Any, { value ->
                    transformMatrix = transformMatrix.setRotate((value as Float).toDouble())
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.transform.translate.x", oldValue.translate.x.toFloat() as Any, newValue.translate.x.toFloat() as Any, { translateX ->
                    transformMatrix = transformMatrix.setTranslate((translateX as Float).toDouble(), null)
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.transform.translate.y", oldValue.translate.y.toFloat() as Any, newValue.translate.y.toFloat() as Any, { translateY ->
                    transformMatrix = transformMatrix.setTranslate(null, (translateY as Float).toDouble())
                }))
                return
            }
            if (!this.transformMatrixChangeViaJavascript) {
                scriptObject()?.let {
                    XTContext.invokeMethod(it, "handleTransformChange")
                    XTContext.release(it)
                }
            }
            field = value
            invalidate()
        }

    override fun getMatrix(): Matrix {
        return transformMatrix.toNativeMatrix(resources.displayMetrics.density)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        frame?.let {
            val scale = resources.displayMetrics.density
            x = (it.x * scale).toFloat()
            y = (it.y * scale).toFloat()
            setMeasuredDimension((it.width * scale).toInt(), (it.height * scale).toInt())
        }
    }

    var opaque = false

    override fun isOpaque(): Boolean {
        super.isOpaque()
        return opaque
    }

    // Mark: View Rendering

    override fun setAlpha(alpha: Float) {
        if (XTUIViewAnimator.animationEnabled) {
            XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.alpha", this.alpha as Any, alpha as Any, {
                this.alpha = it as Float
            }))
            return
        }
        super.setAlpha(alpha)
    }

    open var backgroundColor: XTUIColor = XTUIColor(0.0, 0.0, 0.0, 0.0)
        set(value) {
            if (XTUIViewAnimator.animationEnabled) {
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.backgroundColor.r", (this.backgroundColor.r).toFloat() as Any, value.r.toFloat() as Any, { r ->
                    this.backgroundColor?.let {
                        this.backgroundColor = XTUIColor(Math.max(0.0, Math.min(1.0, (r as Float).toDouble())), it.g, it.b, it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.backgroundColor.g", (this.backgroundColor.g).toFloat() as Any, value.g.toFloat() as Any, { g ->
                    this.backgroundColor?.let {
                        this.backgroundColor = XTUIColor(it.r, Math.max(0.0, Math.min(1.0, (g as Float).toDouble())), it.b, it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.backgroundColor.b", (this.backgroundColor.b).toFloat() as Any, value.b.toFloat() as Any, { b ->
                    this.backgroundColor?.let {
                        this.backgroundColor = XTUIColor(it.r, it.g, Math.max(0.0, Math.min(1.0, (b as Float).toDouble())), it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.backgroundColor.a", (this.backgroundColor.a).toFloat() as Any, value.a.toFloat() as Any, { a ->
                    this.backgroundColor?.let {
                        this.backgroundColor = XTUIColor(it.r, it.g, it.b, Math.max(0.0, Math.min(1.0, (a as Float).toDouble())))
                    }
                }))
                return
            }
            field = value
            invalidate()
        }

    var tintColor: XTUIColor? = null
        get() {
            return if (field != null) {
                field
            } else {
                (this.parent as? XTUIView)?.tintColor ?: XTUIColor(0.0, 122.0 / 255.0, 1.0, 1.0)
            }
        }
        set(value) {
            field = value
            tintColorDidChange()
        }

    open fun tintColorDidChange() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "tintColorDidChange")
            XTContext.release(it)
            (0 until childCount).forEach {
                (getChildAt(it) as? XTUIView)?.let {
                    it.tintColorDidChange()
                }
            }
        }
    }

    var cornerRadius: Double = 0.0
        set(value) {
            if (XTUIViewAnimator.animationEnabled) {
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.cornerRadius", this.cornerRadius.toFloat() as Any, value.toFloat() as Any, {
                    this.cornerRadius = (it as Float).toDouble()
                }))
                return
            }
            field = Math.max(0.0, value)
            resetPath()
            invalidate()
        }

    var borderWidth: Double = 0.0
        set(value) {
            if (XTUIViewAnimator.animationEnabled) {
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.borderWidth", this.borderWidth.toFloat() as Any, value.toFloat() as Any, {
                    this.borderWidth = (it as Float).toDouble()
                }))
                return
            }
            field = value
            invalidate()
        }

    var borderColor: XTUIColor = XTUIColor(0.0, 0.0, 0.0, 0.0)
        set(value) {
            if (XTUIViewAnimator.animationEnabled) {
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.borderColor.r", (this.borderColor.r).toFloat() as Any, value.r.toFloat() as Any, { r ->
                    this.borderColor?.let {
                        this.borderColor = XTUIColor(Math.max(0.0, Math.min(1.0, (r as Float).toDouble())), it.g, it.b, it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.borderColor.g", (this.borderColor.g).toFloat() as Any, value.g.toFloat() as Any, { g ->
                    this.borderColor?.let {
                        this.borderColor = XTUIColor(it.r, Math.max(0.0, Math.min(1.0, (g as Float).toDouble())), it.b, it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.borderColor.b", (this.borderColor.b).toFloat() as Any, value.b.toFloat() as Any, { b ->
                    this.borderColor?.let {
                        this.borderColor = XTUIColor(it.r, it.g, Math.max(0.0, Math.min(1.0, (b as Float).toDouble())), it.a)
                    }
                }))
                XTUIViewAnimator.addAnimation(XTUIViewAnimationProperty("$objectUUID.borderColor.a", (this.borderColor.a).toFloat() as Any, value.a.toFloat() as Any, { a ->
                    this.borderColor?.let {
                        this.borderColor = XTUIColor(it.r, it.g, it.b, Math.max(0.0, Math.min(1.0, (a as Float).toDouble())))
                    }
                }))
                return
            }
            field = value
            invalidate()
        }

    var shadowColor: XTUIColor = XTUIColor(0.0, 0.0, 0.0, 0.0)
        set(value) {
            field = value
            shadowBitmap = null
            invalidate()
        }

    var shadowOpacity: Double = 0.0
        set(value) {
            field = value
            shadowBitmap = null
            invalidate()
        }

    var shadowOffset: XTUISize = XTUISize(0.0, -3.0)
        set(value) {
            field = value
            invalidate()
        }

    var shadowRadius: Double = 0.0
        set(value) {
            field = value
            shadowBitmap = null
            invalidate()
        }

    private val outerPath = Path()
    private val sharedPaint = Paint()

    private fun resetPath() {
        outerPath.reset()
        val scale = resources.displayMetrics.density
        outerPath.addRoundRect(RectF(0.0f, 0.0f, (bounds.width * scale).toFloat(), (bounds.height * scale).toFloat()), (cornerRadius * scale).toFloat(), (cornerRadius * scale).toFloat(), Path.Direction.CCW)
    }

    override fun draw(canvas: Canvas?) {
        canvas?.save()
        if (!transformMatrix.isIdentity()) {
            val scale = resources.displayMetrics.density
            val unMatrix = transformMatrix.unMatrix()
            val matrix = Matrix()
            matrix.postTranslate(-(this.width / 2.0).toFloat(), -(this.height / 2.0).toFloat())
            matrix.postRotate(unMatrix.degree.toFloat())
            matrix.postScale(unMatrix.scale.x.toFloat(), unMatrix.scale.y.toFloat())
            matrix.postTranslate((unMatrix.translate.x * scale).toFloat(), (unMatrix.translate.y * scale).toFloat())
            matrix.postTranslate((this.width / 2.0).toFloat(), (this.height / 2.0).toFloat())
            canvas?.concat(matrix)
        }
        drawShadow(canvas)
        if (backgroundColor.a > 0.0) {
            sharedPaint.reset()
            sharedPaint.isAntiAlias = true
            sharedPaint.style = Paint.Style.FILL
            sharedPaint.color = backgroundColor.intColor()
            canvas?.drawPath(outerPath, sharedPaint)
        }
        if (clipsToBounds) {
            canvas?.save()
            canvas?.clipPath(outerPath)
            super.draw(canvas)
            drawContent(canvas)
            canvas?.restore()
        }
        else {
            super.draw(canvas)
            drawContent(canvas)
        }
        if (borderWidth > 0 && borderColor != null) {
            sharedPaint.reset()
            sharedPaint.isAntiAlias = true
            sharedPaint.style = Paint.Style.STROKE
            sharedPaint.strokeWidth = (borderWidth * resources.displayMetrics.density).toFloat()
            sharedPaint.color = borderColor.intColor()
            canvas?.drawPath(outerPath, sharedPaint)
        }
        canvas?.restore()
    }

    protected open fun drawContent(canvas: Canvas?) {

    }

    private var shadowBitmap: Bitmap? = null
        set(value) {
            field?.let { it.recycle() }
            field = value
        }

    private fun drawShadow(canvas: Canvas?) {
        if (shadowColor.a > 0 && shadowOpacity > 0 && shadowRadius > 0 && this.shadowBitmap == null) {
            val width = (this.bounds.width + shadowRadius * 2) * resources.displayMetrics.density
            val height = (this.bounds.height + shadowRadius * 2) * resources.displayMetrics.density
            val shadowBitmap = Bitmap.createBitmap(width.toInt(), height.toInt(), Bitmap.Config.ARGB_8888)
            val canvas = Canvas(shadowBitmap)
            val paint = Paint()
            paint.color = shadowColor.intColor()
            paint.alpha = (shadowOpacity * 255).toInt()
            paint.maskFilter = BlurMaskFilter((shadowRadius * resources.displayMetrics.density).toFloat(), BlurMaskFilter.Blur.NORMAL)
            canvas.translate((shadowRadius * resources.displayMetrics.density).toFloat(), (shadowRadius * resources.displayMetrics.density).toFloat())
            canvas.drawPath(this.outerPath, paint)
            this.shadowBitmap = shadowBitmap
        }
        this.shadowBitmap?.let {
            sharedPaint.reset()
            canvas?.drawBitmap(
                    it,
                    ((-shadowRadius + shadowOffset.width) * resources.displayMetrics.density).toFloat(),
                    ((-shadowRadius + shadowOffset.height) * resources.displayMetrics.density).toFloat(),
                    sharedPaint)
        }
    }

    var userInteractionEnabled = true

    var mTag: Int = 0

    fun didAddSubview(subview: View) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_didAddSubview", listOf((subview as? XTComponentInstance)?.objectUUID ?: V8.getUndefined()))
            XTContext.release(it)
            (subview as? XTUIView)?.tintColorDidChange()
        }
    }

    fun willRemoveSubView(subview: View) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_willRemoveSubview", listOf((subview as? XTComponentInstance)?.objectUUID ?: V8.getUndefined()))
            XTContext.release(it)
        }
    }

    fun willMoveToSuperview(newSuperview: View?) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_willMoveToSuperview", listOf((newSuperview as? XTComponentInstance)?.objectUUID ?: V8.getUndefined()))
            XTContext.release(it)
        }
    }

    fun didMoveToSuperview() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_didMoveToSuperview")
            XTContext.release(it)
        }
    }

    fun willMoveToWindow(newWindow: XTUIWindow?) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_willMoveToWindow", listOf((newWindow as? XTComponentInstance)?.objectUUID ?: V8.getUndefined()))
            XTContext.release(it)
        }
    }

    fun didMoveToWindow() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_didMoveToWindow")
            XTContext.release(it)
        }
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        if (changed) {
            this.bounds = XTUIRect(0.0, 0.0, frame?.width ?: (this.width / resources.displayMetrics.density).toDouble(), frame?.height ?: (this.height / resources.displayMetrics.density).toDouble())
            layoutSubviews()
        }
    }

    open fun layoutSubviews() {
        viewDelegate?.get()?.viewWillLayoutSubviews()
        scriptObject()?.let {
            XTContext.invokeMethod(it, "layoutSubviews")
            XTContext.release(it)
        }
        viewDelegate?.get()?.viewDidLayoutSubviews()
    }

    open fun intrinsicContentSize(width: Double): XTUISize? {
        return null
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        return false
    }

    open class JSExports(val context: XTUIContext): XTComponentExport() {

        override val name: String = "_XTUIView"

        open val viewClass: Class<XTUIView> = XTUIView::class.java

        override fun exports(): V8Object {
            val exports = V8Object(context.runtime)
            exports.registerJavaMethod(this, "create", "create", arrayOf())
            exports.registerJavaMethod(this, "xtr_clipsToBounds", "xtr_clipsToBounds", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setClipsToBounds", "xtr_setClipsToBounds", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_alpha", "xtr_alpha", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setAlpha", "xtr_setAlpha", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_frame", "xtr_frame", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setFrame", "xtr_setFrame", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_bounds", "xtr_bounds", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_transform", "xtr_transform", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setTransform", "xtr_setTransform", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_backgroundColor", "xtr_backgroundColor", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setBackgroundColor", "xtr_setBackgroundColor", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_hidden", "xtr_hidden", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setHidden", "xtr_setHidden", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_tag", "xtr_tag", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setTag", "xtr_setTag", arrayOf(Int::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_opaque", "xtr_opaque", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setOpaque", "xtr_setOpaque", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_tintColor", "xtr_tintColor", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setTintColor", "xtr_setTintColor", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_cornerRadius", "xtr_cornerRadius", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setCornerRadius", "xtr_setCornerRadius", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_borderWidth", "xtr_borderWidth", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setBorderWidth", "xtr_setBorderWidth", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_borderColor", "xtr_borderColor", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setBorderColor", "xtr_setBorderColor", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_shadowColor", "xtr_shadowColor", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setShadowColor", "xtr_setShadowColor", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_shadowOpacity", "xtr_shadowOpacity", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setShadowOpacity", "xtr_setShadowOpacity", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_shadowOffset", "xtr_shadowOffset", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setShadowOffset", "xtr_setShadowOffset", arrayOf(V8Object::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_shadowRadius", "xtr_shadowRadius", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setShadowRadius", "xtr_setShadowRadius", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_superview", "xtr_superview", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_subviews", "xtr_subviews", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_window", "xtr_window", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_removeFromSuperview", "xtr_removeFromSuperview", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_insertSubviewAtIndex", "xtr_insertSubviewAtIndex", arrayOf(String::class.java, Int::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_exchangeSubviewAtIndex", "xtr_exchangeSubviewAtIndex", arrayOf(Int::class.java, Int::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_addSubview", "xtr_addSubview", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_insertSubviewBelow", "xtr_insertSubviewBelow", arrayOf(String::class.java, String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_insertSubviewAbove", "xtr_insertSubviewAbove", arrayOf(String::class.java, String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_bringSubviewToFront", "xtr_bringSubviewToFront", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_sendSubviewToBack", "xtr_sendSubviewToBack", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_isDescendantOfView", "xtr_isDescendantOfView", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_viewWithTag", "xtr_viewWithTag", arrayOf(Int::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_setNeedsLayout", "xtr_setNeedsLayout", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_layoutIfNeeded", "xtr_layoutIfNeeded", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_intrinsicContentSize", "xtr_intrinsicContentSize", arrayOf(Double::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_userInteractionEnabled", "xtr_userInteractionEnabled", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setUserInteractionEnabled", "xtr_setUserInteractionEnabled", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_animationWithDuration", "xtr_animationWithDuration", arrayOf(Double::class.java, V8Function::class.java, V8Function::class.java))
            exports.registerJavaMethod(this, "xtr_animationWithBouncinessAndSpeed", "xtr_animationWithBouncinessAndSpeed", arrayOf(Double::class.java, Double::class.java, V8Function::class.java, V8Function::class.java))
            return exports
        }

        fun create(): String {
            val view = viewClass.getDeclaredConstructor(XTUIContext::class.java).newInstance(context)
            val managedObject = XTManagedObject(view)
            view.objectUUID = managedObject.objectUUID
            XTMemoryManager.add(managedObject)
            return managedObject.objectUUID
        }

        // Mark: View Geometry

        fun xtr_clipsToBounds(objectRef: String): Boolean {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.clipsToBounds } ?: false
        }

        fun xtr_setClipsToBounds(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.clipsToBounds = value
                if (android.os.Build.VERSION.SDK_INT < 18) {
                    it.setLayerType(if (value) View.LAYER_TYPE_SOFTWARE else View.LAYER_TYPE_HARDWARE, null)
                }
            }
        }

        fun xtr_alpha(objectRef: String): Double {
            return (XTMemoryManager.find(objectRef) as? View)?.let { it.alpha.toDouble() } ?: 0.0
        }

        fun xtr_setAlpha(alpha: Double, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? View)?.let {
                it.alpha = alpha.toFloat()
            }
        }

        fun xtr_frame(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromRect(it.frame ?: XTUIRect(0.0, 0.0, (it.width / it.resources.displayMetrics.density).toDouble(), (it.height / it.resources.displayMetrics.density).toDouble()), context.runtime)
            } ?: XTUIUtils.fromRect(XTUIRect(0.0,0.0,0.0,0.0), context.runtime)
        }

        fun xtr_setFrame(value: V8Object, objectRef: String) {
            XTUIUtils.toRect(value)?.let { frame ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.frameChangeViaJavascript = true
                    it.frame = frame
                    it.frameChangeViaJavascript = false
                }
            }
        }

        open fun xtr_bounds(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromRect(it.bounds, context.runtime)
            } ?: XTUIUtils.fromRect(XTUIRect(0.0,0.0,0.0,0.0), context.runtime)
        }

        fun xtr_transform(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromTransform(it.transformMatrix, context.runtime)
            } ?: XTUIUtils.fromTransform(XTUIMatrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0), context.runtime)
        }

        fun xtr_setTransform(value: V8Object, objectRef: String) {
            XTUIUtils.toTransform(value)?.let { transformMatrix ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.transformMatrix = transformMatrix
                }
            }
        }

        fun xtr_backgroundColor(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromColor(it.backgroundColor, context.runtime)
            } ?: XTUIUtils.fromColor(XTUIColor(0.0, 0.0, 0.0, 0.0), context.runtime)
        }

        fun xtr_setBackgroundColor(value: V8Object, objectRef: String) {
            XTUIUtils.toColor(value)?.let { color ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.backgroundColor = color
                }
            }
        }

        fun xtr_hidden(objectRef: String): Boolean {
            return (XTMemoryManager.find(objectRef) as? View)?.let { it.visibility == View.GONE } ?: false
        }

        fun xtr_setHidden(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? View)?.let {
                it.visibility = if (value) View.GONE else View.VISIBLE
            }
        }

        fun xtr_opaque(objectRef: String): Boolean {
            return (XTMemoryManager.find(objectRef) as? View)?.let { it.isOpaque } ?: false
        }

        fun xtr_setOpaque(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.opaque = value
            }
        }

        fun xtr_tintColor(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromColor(it.tintColor ?: XTUIColor(0.0, 0.0, 0.0, 0.0), context.runtime)
            } ?: XTUIUtils.fromColor(XTUIColor(0.0, 0.0, 0.0, 0.0), context.runtime)
        }

        fun xtr_setTintColor(value: V8Object, objectRef: String) {
            XTUIUtils.toColor(value)?.let { color ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.tintColor = color
                }
            }
        }

        // Mark: View Layer-Back Rendering

        fun xtr_cornerRadius(objectRef: String): Double {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.cornerRadius } ?: 0.0
        }

        fun xtr_setCornerRadius(value: Double, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.cornerRadius = value
            }
        }

        fun xtr_borderWidth(objectRef: String): Double {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.borderWidth } ?: 0.0
        }

        fun xtr_setBorderWidth(value: Double, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.borderWidth = value
            }
        }

        fun xtr_borderColor(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromColor(it.borderColor, context.runtime)
            } ?: XTUIUtils.fromColor(XTUIColor(0.0, 0.0, 0.0, 0.0), context.runtime)
        }

        fun xtr_setBorderColor(value: V8Object, objectRef: String) {
            XTUIUtils.toColor(value)?.let { color ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.borderColor = color
                }
            }
        }

        fun xtr_shadowColor(objectRef: String): V8Value {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromColor(it.shadowColor, context.runtime)
            } ?: XTUIUtils.fromColor(XTUIColor(0.0, 0.0, 0.0, 0.0), context.runtime)
        }

        fun xtr_setShadowColor(value: V8Object, objectRef: String) {
            XTUIUtils.toColor(value)?.let { color ->
                (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                    it.shadowColor = color
                }
            }
        }

        fun xtr_shadowOpacity(objectRef: String): Double {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.shadowOpacity } ?: 0.0
        }

        fun xtr_setShadowOpacity(value: Double, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.shadowOpacity = value
            }
        }

        fun xtr_shadowOffset(objectRef: String): V8Object {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                return@let XTUIUtils.fromSize(it.shadowOffset, context.runtime)
            } ?: XTUIUtils.fromSize(XTUISize(0.0, 0.0), context.runtime)
        }

        fun xtr_setShadowOffset(value: V8Object, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.shadowOffset = XTUIUtils.toSize(value) ?: XTUISize(0.0, 0.0)
            }
        }

        fun xtr_shadowRadius(objectRef: String): Double {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.shadowRadius } ?: 0.0
        }

        fun xtr_setShadowRadius(value: Double, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.shadowRadius = value
            }
        }

        // Mark: View Hierarchy

        fun xtr_tag(objectRef: String): Int {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.mTag ?: 0
        }

        fun xtr_setTag(value: Int, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.mTag = value
        }

        fun xtr_superview(objectRef: String): String? {
            return (XTMemoryManager.find(objectRef) as? View)?.let { (it.parent as? XTComponentInstance)?.objectUUID }
        }

        fun xtr_subviews(objectRef: String): V8Array? {
            return (XTMemoryManager.find(objectRef) as? ViewGroup)?.let {
                val v8Array = V8Array(context.runtime)
                (0 until it.childCount).mapNotNull { idx ->
                    return@mapNotNull (it.getChildAt(idx) as? XTComponentInstance)?.objectUUID
                }.forEach { v8Array.push(it) }
                return@let v8Array
            }
        }

        fun xtr_window(objectRef: String): String? {
            return context?.application?.delegate?.window?.objectUUID
        }

        fun xtr_removeFromSuperview(objectRef: String) {
            (XTMemoryManager.find(objectRef) as? View)?.let {
                (it.parent as? XTUIView)?.willRemoveSubView(it)
                (it as? XTUIView)?.willMoveToSuperview(null)
                (it as? XTUIView)?.willMoveToWindow(null)
                (it.parent as? ViewGroup)?.removeView(it)
                (it as? XTUIView)?.didMoveToSuperview()
                (it as? XTUIView)?.didMoveToWindow()
            }
        }

        fun xtr_insertSubviewAtIndex(subviewRef: String, atIndex: Int, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            val subview = XTMemoryManager.find(subviewRef) as? View ?: return
            (subview as? XTUIView)?.willMoveToSuperview(view)
            (subview as? XTUIView)?.willMoveToWindow(context?.application?.delegate?.window)
            view.addView(subview, atIndex, ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT))
            (view as? XTUIView)?.didAddSubview(subview)
            (subview as? XTUIView)?.didMoveToSuperview()
            (subview as? XTUIView)?.didMoveToWindow()
        }

        fun xtr_exchangeSubviewAtIndex(index1: Int, index2: Int, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            if (index1 > index2) {
                val view1 = view.getChildAt(index1)
                val view2 = view.getChildAt(index2)
                view.removeViewAt(index1)
                view.removeViewAt(index2)
                view.addView(view1, index2)
                view.addView(view2, index1)
            }
            else if (index1 < index2) {
                val view1 = view.getChildAt(index1)
                val view2 = view.getChildAt(index2)
                view.removeViewAt(index2)
                view.removeViewAt(index1)
                view.addView(view2, index1)
                view.addView(view1, index2)
            }
        }

        fun xtr_addSubview(subviewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return kotlin.run {
                val sss = XTMemoryManager.find(objectRef)
                print(sss)
            }
            val subview = XTMemoryManager.find(subviewRef) as? View ?: return
            (subview as? XTUIView)?.willMoveToSuperview(view)
            (subview as? XTUIView)?.willMoveToWindow(context?.application?.delegate?.window)
            view.addView(subview, ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT))
            (view as? XTUIView)?.didAddSubview(subview)
            (subview as? XTUIView)?.didMoveToSuperview()
            (subview as? XTUIView)?.didMoveToWindow()
        }

        fun xtr_insertSubviewBelow(subviewRef: String, siblingSubviewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            val siblingSubview = XTMemoryManager.find(siblingSubviewRef) as? View ?: return
            view.indexOfChild(siblingSubview)?.let {
                if (it >= 0) {
                    xtr_insertSubviewAtIndex(subviewRef, it, objectRef)
                }
            }
        }

        fun xtr_insertSubviewAbove(subviewRef: String, siblingSubviewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            val siblingSubview = XTMemoryManager.find(siblingSubviewRef) as? View ?: return
            view.indexOfChild(siblingSubview)?.let {
                if (it >= 0){
                    xtr_insertSubviewAtIndex(subviewRef, it + 1, objectRef)
                }
            }
        }

        fun xtr_bringSubviewToFront(subviewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            val subview = XTMemoryManager.find(subviewRef) as? View ?: return
            view.bringChildToFront(subview)
        }

        fun xtr_sendSubviewToBack(subviewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            val subview = XTMemoryManager.find(subviewRef) as? View ?: return
            view.removeView(subview)
            view.addView(subview, 0, ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        }

        fun xtr_isDescendantOfView(targetViewRef: String, objectRef: String): Boolean {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return false
            val targetView = XTMemoryManager.find(targetViewRef) as? View ?: return false
            var current: ViewParent? = view
            while (current != null) {
                if (current == targetView) {
                    return true
                }
                current = current.parent
            }
            return false
        }

        fun xtr_viewWithTag(tag: Int, objectRef: String): String? {
            val view = XTMemoryManager.find(objectRef) as? XTUIView ?: return null
            if (view.mTag == tag) {
                return view.objectUUID
            }
            (0 until view.childCount).forEach {
                (view.getChildAt(it) as? XTComponentInstance)?.let {
                    val foundView = xtr_viewWithTag(tag, it.objectUUID ?: "")
                    if (foundView != null) {
                        return foundView
                    }
                }
            }
            return null
        }

        fun xtr_setNeedsLayout(objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            view.requestLayout()
            (view as? XTUIView)?.layoutSubviews()
        }

        fun xtr_layoutIfNeeded(objectRef: String) {
            val view = XTMemoryManager.find(objectRef) as? ViewGroup ?: return
            view.requestLayout()
            (view as? XTUIView)?.layoutSubviews()
        }

        // Mark: View LayoutConstraint

        open fun xtr_intrinsicContentSize(width: Double, objectRef: String): V8Value {
            val view = XTMemoryManager.find(objectRef) as? XTUIView ?: return V8.getUndefined()
            return view.intrinsicContentSize(width)?.let { XTUIUtils.fromSize(it, context.runtime) } ?: V8.getUndefined()
        }

        // Mark: View Interactive

        fun xtr_userInteractionEnabled(objectRef: String): Boolean {
            return (XTMemoryManager.find(objectRef) as? XTUIView)?.let { it.userInteractionEnabled } ?: false
        }

        fun xtr_setUserInteractionEnabled(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIView)?.let {
                it.userInteractionEnabled = value
            }
        }

        fun xtr_animationWithDuration(value: Double, animationBlock: V8Function, completionBlock: V8Function) {
            val animationBlock = animationBlock.twin()
            val completionBlock = completionBlock.twin()
            XTUIViewAnimator.animationWithDuration(value, {
                animationBlock.call(null, null)
            }, {
                if (!completionBlock.runtime.isReleased && !completionBlock.isReleased){
                    completionBlock.call(null, null)
                }
                XTContext.release(animationBlock, completionBlock)
            })
        }

        fun xtr_animationWithBouncinessAndSpeed(bounciness: Double, speed: Double, animationBlock: V8Function, completionBlock: V8Function) {
            val animationBlock = animationBlock.twin()
            val completionBlock = completionBlock.twin()
            XTUIViewAnimator.animationWithBouncinessAndSpeed(bounciness, speed, {
                animationBlock.call(null, null)
            }, {
                if (!completionBlock.runtime.isReleased && !completionBlock.isReleased){
                    completionBlock.call(null, null)
                }
                XTContext.release(animationBlock, completionBlock)
            })
        }

    }

}
package com.opensource.xt.uikit

import android.app.Activity
import android.app.Fragment
import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.view.ViewGroup
import com.eclipsesource.v8.V8
import com.eclipsesource.v8.V8Array
import com.eclipsesource.v8.V8Object
import com.eclipsesource.v8.utils.V8ObjectUtils
import com.opensource.xt.core.*
import com.opensource.xt.uikit.libraries.keyboard.KeyboardHeightObserver
import com.opensource.xt.uikit.libraries.keyboard.KeyboardHeightProvider
import java.lang.ref.WeakReference

/**
 * Created by cuiminghui on 2017/9/5.
 */
open class XTUIViewController: XTUIFragment(), XTComponentInstance, KeyboardHeightObserver {

    override var objectUUID: String? = null
    lateinit var xtrContext: XTUIContext

    override var view: XTUIView? = null
        set(value) {
            if (field != null) { return }
            if (value == null) { return }
            field = value
            value.viewDelegate = WeakReference(this)
        }

    internal var showBackButton = false

    var parentViewController: WeakReference<XTUIViewController>? = null
        internal set

    var childViewControllers: List<XTUIViewController> = listOf()
        internal set

    internal var supportOrientations: List<Int> = listOf(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)
        set(value) {
            field = value
            (activity as? XTUIActivity)?.resetOrientation()
        }

    open fun setContentView(activity: Activity) {
        XTUIScreen.resetScreenInfo(activity)
        this.requestFragment().let {
            val transaction = activity.fragmentManager.beginTransaction()
            transaction.replace(android.R.id.content, it)
            transaction.commit()
            it.setupKeyboardHeightProvider(activity)
        }
    }

    open fun attachFragment(activity: Activity, fragmentID: Int) {
        XTUIScreen.resetScreenInfo(activity)
        this.requestFragment().let {
            val transaction = activity.fragmentManager.beginTransaction()
            transaction.replace(fragmentID, it)
            transaction.commit()
            it.noStatusBar = true
            it.noSoftButtonBar = true
            it.resetContents()
            it.setupKeyboardHeightProvider(activity)
        }
    }

    fun scriptObject(): V8Object? {
        return xtrContext.evaluateScript("objectRefs['$objectUUID']") as? V8Object
    }

    open fun requestFragment(): XTUIViewController {
        return this
    }

    private var isViewLoaded = false

    open fun viewDidLoad() {
        isViewLoaded = true
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewDidLoad")
            XTContext.release(it)
        }
        this.viewWillLayoutSubviews()
        this.viewDidLayoutSubviews()
    }

    open fun viewWillAppear() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewWillAppear")
            XTContext.release(it)
        }
    }

    open fun viewDidAppear() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewDidAppear")
            XTContext.release(it)
        }
    }

    open fun viewWillDisappear() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewWillDisappear")
            XTContext.release(it)
        }
    }

    open fun viewDidDisappear() {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewDidDisappear")
            XTContext.release(it)
        }
    }

    open fun viewWillLayoutSubviews() {
        if (!isViewLoaded) { return }
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewWillLayoutSubviews")
            XTContext.release(it)
        }
    }

    open fun viewDidLayoutSubviews() {
        if (!isViewLoaded) { return }
        scriptObject()?.let {
            XTContext.invokeMethod(it, "viewDidLayoutSubviews")
            XTContext.release(it)
        }
    }

    fun willMoveToParentViewController(parent: XTUIViewController?) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_willMoveToParentViewController", listOf(
                    parent?.objectUUID ?: V8.getUndefined()
            ))
        }
    }

    fun didMoveToParentViewController(parent: XTUIViewController?) {
        scriptObject()?.let {
            XTContext.invokeMethod(it, "_didMoveToParentViewController", listOf(
                    parent?.objectUUID ?: V8.getUndefined()
            ))
        }
    }

    private var keyboardHeightProvider: KeyboardHeightProvider? = null

    private fun setupKeyboardHeightProvider(activity: Activity) {
        keyboardHeightProvider = KeyboardHeightProvider(activity)
        activity.findViewById<View>(android.R.id.content).rootView?.post {
            keyboardHeightProvider?.start()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        keyboardHeightProvider?.close()
    }

    override fun onPause() {
        super.onPause()
        keyboardHeightProvider?.setKeyboardHeightObserver(null)
    }

    override fun onResume() {
        super.onResume()
        keyboardHeightProvider?.setKeyboardHeightObserver(this)
    }

    override fun onKeyboardHeightChanged(height: Int, orientation: Int) {
        this.lastKeyboardHeight = height
        handleKeyboardHeightChanged(height)
    }

    var lastKeyboardHeight = 0

    fun handleKeyboardHeightChanged(height: Int = this.lastKeyboardHeight) {
        scriptObject()?.let {
            if (height > 0) {
                XTContext.invokeMethod(it, "keyboardWillShow", listOf(
                        XTUIUtils.fromRect(XTUIRect(
                                0.0,
                                0.0,
                                this.view?.bounds?.width ?: 0.0,
                                height.toDouble() / resources.displayMetrics.density), xtrContext.runtime), 0.25))
            }
            else {
                XTContext.invokeMethod(it, "keyboardWillHide", listOf(0.25))
            }
            XTContext.release(it)
        }
    }

    class JSExports(val context: XTUIContext): XTComponentExport() {

        override val name: String = "_XTUIViewController"

        override fun exports(): V8Object {
            val exports = V8Object(context.runtime)
            exports.registerJavaMethod(this, "create", "create", arrayOf())
            exports.registerJavaMethod(this, "xtr_view", "xtr_view", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setView", "xtr_setView", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_parentViewController", "xtr_parentViewController", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_childViewControllers", "xtr_childViewControllers", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_addChildViewController", "xtr_addChildViewController", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_removeFromParentViewController", "xtr_removeFromParentViewController", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_navigationController", "xtr_navigationController", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_navigationBar", "xtr_navigationBar", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_setNavigationBar", "xtr_setNavigationBar", arrayOf(String::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_showNavigationBar", "xtr_showNavigationBar", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_hideNavigationBar", "xtr_hideNavigationBar", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_showBackButton", "xtr_showBackButton", arrayOf(String::class.java))
            exports.registerJavaMethod(this, "xtr_presentViewController", "xtr_presentViewController", arrayOf(String::class.java, Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_dismissViewController", "xtr_dismissViewController", arrayOf(Boolean::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_setSupportOrientations", "xtr_setSupportOrientations", arrayOf(V8Array::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_setLayoutOptions", "xtr_setLayoutOptions", arrayOf(V8Array::class.java, String::class.java))
            exports.registerJavaMethod(this, "xtr_safeAreaInsets", "xtr_safeAreaInsets", arrayOf(String::class.java))
            return exports
        }

        fun create(): String {
            val viewController = XTUIViewController()
            viewController.xtrContext = context
            val managedObject = XTManagedObject(viewController)
            viewController.objectUUID = managedObject.objectUUID
            XTMemoryManager.add(managedObject)
            return managedObject.objectUUID
        }

        fun xtr_view(objectRef: String): String? {
            return (XTMemoryManager.find(objectRef) as? XTUIViewController)?.view?.objectUUID
        }

        fun xtr_setView(viewRef: String, objectRef: String) {
            val view = XTMemoryManager.find(viewRef) as? XTUIView ?: return
            val viewController = XTMemoryManager.find(objectRef) as? XTUIViewController ?: return
            viewController.view = view
            view.post {
                viewController.viewDidLoad()
            }
        }

        fun xtr_parentViewController(objectRef: String): String? {
            return (XTMemoryManager.find(objectRef) as? XTUIViewController)?.parentViewController?.get()?.objectUUID
        }

        fun xtr_childViewControllers(objectRef: String): V8Array? {
            return (XTMemoryManager.find(objectRef) as? XTUIViewController)?.let {
                val v8Array = V8Array(context.runtime)
                it.childViewControllers.mapNotNull { it ->
                    return@mapNotNull it.objectUUID
                }.forEach { v8Array.push(it) }
                return@let v8Array
            }
        }

        fun xtr_addChildViewController(childControllerRef: String, objectRef: String) {
            val childController = XTMemoryManager.find(childControllerRef) as? XTUIViewController ?: return
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.let {
                if (childController.parentViewController == null) {
                    childController.willMoveToParentViewController(it)
                    it.childViewControllers.toMutableList()?.let { mutable ->
                        mutable.add(childController)
                        childController.parentViewController = WeakReference(it)
                        it.childViewControllers = mutable.toList()
                    }
                    childController.didMoveToParentViewController(it)
                }
            }
        }

        fun xtr_removeFromParentViewController(objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.let {
                it.parentViewController?.let { parentViewController ->
                    it.willMoveToParentViewController(null)
                    parentViewController.get()?.childViewControllers?.toMutableList()?.let { mutable ->
                        mutable.remove(it)
                        parentViewController.get()?.childViewControllers = mutable.toList()
                    }
                    it.didMoveToParentViewController(null)
                }
                it.parentViewController = null
            }
        }

        fun xtr_navigationController(objectRef: String): String? {
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.let {
                var currentParentViewController = it.parentViewController?.get()
                while (currentParentViewController != null) {
                    if (currentParentViewController is XTUINavigationController) {
                        return currentParentViewController.objectUUID
                    }
                    currentParentViewController = currentParentViewController.parentViewController?.get()
                }
            }
            return null
        }

        fun xtr_navigationBar(objectRef: String): String? {
            return (XTMemoryManager.find(objectRef) as? XTUIViewController)?.requestFragment()?.navigationBar?.objectUUID
        }

        fun xtr_setNavigationBar(navigationBarRef: String, objectRef: String) {
            val navigationBar = XTMemoryManager.find(navigationBarRef) as? XTUINavigationBar ?: return
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.requestFragment()?.navigationBar = navigationBar
        }

        fun xtr_showNavigationBar(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.requestFragment()?.navigationBarHidden = false
        }

        fun xtr_hideNavigationBar(value: Boolean, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.requestFragment()?.navigationBarHidden = true
        }

        fun xtr_showBackButton(objectRef: String): Boolean {
            val viewController = (XTMemoryManager.find(objectRef) as? XTUIViewController) ?: return false
            return viewController?.activity?.intent?.getBooleanExtra("XTUIShowBackButton", viewController.showBackButton) ?: viewController.showBackButton
        }

        fun xtr_presentViewController(viewControllerRef: String, animated: Boolean, objectRef: String) {
            val targetViewController = (XTMemoryManager.find(viewControllerRef) as? XTUIViewController) ?: return
            val intent = Intent(context.appContext, NextActivity::class.java)
            if (!animated) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
            }
            intent.putExtra("ViewControllerObjectUUID", targetViewController.objectUUID)
            context.appContext.startActivity(intent)
        }

        fun xtr_dismissViewController(animated: Boolean, objectRef: String) {
            val viewController = (XTMemoryManager.find(objectRef) as? XTUIViewController) ?: return
            viewController.requestFragment()?.let {
                (it.activity as? NextActivity)?.finishWithAnimation = !animated
                it.activity.finish()
            }
        }

        fun xtr_setSupportOrientations(value: V8Array, objectRef: String) {
            V8ObjectUtils.toList(value)?.let {
                var newValue = mutableListOf<Int>()
                if (it.contains(1)) {
                    newValue.add(1)
                }
                if (it.contains(2)) {
                    newValue.add(2)
                }
                if (it.contains(3)) {
                    newValue.add(3)
                }
                if (it.contains(4)) {
                    newValue.add(4)
                }
                (XTMemoryManager.find(objectRef) as? XTUIViewController)?.supportOrientations = newValue.toList()
            }
        }

        fun xtr_setLayoutOptions(value: V8Array, objectRef: String) {
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.layoutOptions = V8ObjectUtils.toList(value).mapNotNull { it as? Int }
        }

        fun xtr_safeAreaInsets(objectRef: String): V8Object {
            val v8Object = V8Object(context.runtime)
            v8Object.add("top", 0)
            v8Object.add("left", 0)
            v8Object.add("bottom", 0)
            v8Object.add("right", 0)
            (XTMemoryManager.find(objectRef) as? XTUIViewController)?.let {
                if (it.navigationBarHidden) {
                    v8Object.add("top", it.getStatusBarHeight())
                }
            }
            return v8Object
        }

    }

    class NextActivity: XTUIActivity() {

        var viewController: XTUIViewController? = null
        var finishWithAnimation = true

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            intent?.getStringExtra("ViewControllerObjectUUID")?.let {
                this.viewController = XTMemoryManager.find(it) as? XTUIViewController
            }
            this.viewController?.setContentView(this)
        }

        override fun onPause() {
            if (finishWithAnimation) {
                this.overridePendingTransition(0, 0)
            }
            super.onPause()
        }

    }

}
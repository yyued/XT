package com.opensource.xtsample

import android.app.Activity
import android.os.Bundle
import android.widget.EditText
import com.opensource.xtruntime.XTRActivity
import com.opensource.xtruntime.XTRBridge
import com.opensource.xtruntime.XTRFragment
import com.opensource.xtruntime.XTRCustomView

class AppActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        XTRCustomView.registerClass(FOOView::class.java.name, "FOOView")
        val bridge = XTRBridge.createWithAssets(this, "sample.min.js", {
            it.keyWindow?.rootViewController?.setContentView(this)
        })
    }

//    override fun onCreate(savedInstanceState: Bundle?) {
//        loadLocal()
//        registerViews()
//        super.onCreate(savedInstanceState)
//    }
//
//    fun registerViews() {
////        XTRCustomView.registerClass(FOOView::class.java.name, "FOOView")
//    }
//
//    fun loadRemote() {
//        this.bridge = XTRBridge.createWithSourceURL(this, "http://172.26.80.36:8083/sample.min.js", {
//            onBridgeReady()
//        })
//    }
//
//    fun loadLocal() {
//        this.bridge = XTRBridge.createWithAssets(this, "sample.min.js", {
//            onBridgeReady()
//        })
//    }

}

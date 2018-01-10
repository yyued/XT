package com.opensource.xtruntime

import android.app.Activity
import android.app.AlertDialog
import android.app.ProgressDialog
import android.graphics.Color
import android.os.Build
import android.os.Handler
import android.os.StrictMode
import android.widget.EditText
import com.eclipsesource.v8.V8Array
import com.eclipsesource.v8.V8Function
import com.eclipsesource.v8.V8Object
import okhttp3.*
import org.json.JSONObject
import java.net.URI
import java.net.URLEncoder
import java.util.concurrent.TimeUnit

/**
 * Created by cuiminghui on 2017/9/20.
 */

class XTRDebug {

    companion object {

        var breakpointsEnabled = false

        fun showMenu(activity: Activity, bridge: XTRBridge) {
            val builder = AlertDialog.Builder(activity)
            builder.setTitle("Debugger")
            builder.setItems(listOf(
                    "Reload",
                    "Reset Source URL",
                    (if (breakpointsEnabled) "Disable Breakpoints" else "Enable Breakpoints")
            ).toTypedArray(), { _, idx ->
                if (idx == 0) {
                    bridge.loadScript()
                }
                else if (idx == 1) {
                    resetSourceURL(activity, bridge)
                }
                else if (idx == 2) {
                    breakpointsEnabled = !breakpointsEnabled
                }
                return@setItems
            })
            builder.setCancelable(true)
            builder.create().show()
        }

        fun resetSourceURL(activity: Activity, bridge: XTRBridge) {
            val builder = AlertDialog.Builder(activity)
            builder.setTitle("Enter SourceURL / PinCode")
            val editText = EditText(bridge.appContext)
            editText.setTextColor(Color.BLACK)
            editText.setSingleLine(true)
            editText.text.append(bridge.sourceURL ?: "")
            builder.setView(editText)
            builder.setPositiveButton("Continue", { _, _ ->
                val text = editText.text.toString()
                if (text.length == 6 || text.length == 1) {
                    resetSourceURLViaPinCode(activity, bridge, text)
                }
                else {
                    bridge.sourceURL = text
                    sendConnectedMessage(bridge)
                }
            })
            builder.create().show()
        }

        fun resetSourceURLViaPinCode(activity: Activity, bridge: XTRBridge, code: String) {
            val dialog = ProgressDialog(activity)
            dialog.setMessage("Connecting...")
            dialog.show()
            Thread({
                try {
                    val client = OkHttpClient()
                    if (code == "0") {
                        val request = Request.Builder().cacheControl(CacheControl.Builder().noCache().build()).url("http://10.0.2.2:8083/").get().build()
                        val response = client.newCall(request).execute()
                        response.body()?.string()?.let { files ->
                            files.split("\n").forEach {
                                if (it.endsWith("android.min.js")) {
                                    Handler(bridge.appContext.mainLooper).post {
                                        bridge.sourceURL = it
                                        dialog.hide()
                                        sendConnectedMessage(bridge)
                                    }
                                    return@Thread
                                }
                            }
                        }
                    }
                    else {
                        val request = Request.Builder()
                                .cacheControl(CacheControl.Builder().noCache().build())
                                .url("https://zax3y00w.api.lncld.net/1.1/classes/Pin?where=%7B%22PinCode%22%3A$code%7D&limit=1&&order=-updatedAt&&")
                                .addHeader("Content-Type", "application/json")
                                .addHeader("X-LC-Id", "zAx3Y00WjcMeXeuaxfw9HSsQ-gzGzoHsz")
                                .addHeader("X-LC-Key", "pKOyX7Czry2YS9y6KR6G4X34")
                                .get()
                                .build()
                        val response = client.newCall(request).execute()
                        response.body()?.string()?.let { result ->
                            val obj = JSONObject(result)
                            val services = obj.optJSONArray("results")?.getJSONObject(0)?.optJSONArray("services") ?: throw Exception("Invalid PinCode")
                            (0 until services.length())?.forEach {
                                try {
                                    val request = Request.Builder().url(services.getString(it)).get().build()
                                    val response = client.newCall(request).execute()
                                    response.body()?.string()?.let { files ->
                                        files.split("\n").forEach {
                                            if (it.endsWith("android.min.js")) {
                                                Handler(bridge.appContext.mainLooper).post {
                                                    bridge.sourceURL = it
                                                    dialog.hide()
                                                    sendConnectedMessage(bridge)
                                                }
                                                return@Thread
                                            }
                                        }
                                    }
                                } catch (e: Exception) {}
                            }
                        }
                    }
                } catch (e: Exception) {
                    Handler(bridge.appContext.mainLooper).post {
                        dialog.hide()
                        AlertDialog.Builder(activity).setTitle("Failure").setMessage("Invalid PinCode").setPositiveButton("Try again", {_, _ ->}).create().show()
                    }
                }
            }).start()
        }

        fun sendConnectedMessage(bridge: XTRBridge) {
            Thread({
                try {
                    val request = Request.Builder()
                            .cacheControl(CacheControl.Builder().noCache().build())
                            .url(URI(bridge.sourceURL).resolve("/connected/Android_OS_" + Build.VERSION.SDK_INT).toString())
                            .get()
                            .build()
                    OkHttpClient().newCall(request).execute()
                } catch (e: Exception) {}
            }).start()
        }

    }

}

class XTRBreakpoint(val bridge: XTRBridge) {

    init {
        val v8Object = V8Object(bridge.xtrContext.runtime)
        v8Object.registerJavaMethod(this, "breaking", "breaking", arrayOf(String::class.java, V8Function::class.java))
        bridge.xtrContext.runtime.add("XTRBreakpointInstance", v8Object)
        bridge.xtrContext.evaluateScript("var XTRBreakpoint = function(id, eval) { XTRBreakpointInstance.breaking(id, eval) };")
        v8Object.release()
    }

    fun breaking(id: String, eval: V8Function) {
        if (!XTRDebug.breakpointsEnabled) { return }
        StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.Builder().permitAll().build())
        val client = OkHttpClient.Builder().connectTimeout(5, TimeUnit.SECONDS).readTimeout(600, TimeUnit.SECONDS).build()
        while (true) {
            try {
                val request = Request.Builder()
                        .cacheControl(CacheControl.Builder().noCache().build())
                        .url(URI(bridge.sourceURL).resolve("/breakpoint/" + URLEncoder.encode(((id as? String) ?: ""))).toString())
                        .get()
                        .build()
                val response = client.newCall(request).execute()
                val result = response.body()?.string()
                if (result == "1") {
                    break
                }
                else {
                    val params = V8Array(bridge.xtrContext.runtime)
                    result?.let { params.push(it) }
                    try {
                        val evalResult = eval.call(null, params)
                        val request = Request.Builder()
                                .cacheControl(CacheControl.Builder().noCache().build())
                                .url(URI(bridge.sourceURL).resolve("/evalresult/" + URLEncoder.encode(evalResult.toString())).toString())
                                .get()
                                .build()
                        client.newCall(request).execute()
                    } catch (e: Exception) { }
                }
            } catch (e: Exception) {
                break
            }
        }
    }

}
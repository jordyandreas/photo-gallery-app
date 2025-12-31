package com.photogalleryapp

import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class FavoriteConfirmationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "FavoriteConfirmationModule"
    }

    @ReactMethod
    fun showToast(message: String) {
        UiThreadUtil.runOnUiThread {
            Toast.makeText(reactApplicationContext, message, Toast.LENGTH_SHORT).show()
        }
    }
}


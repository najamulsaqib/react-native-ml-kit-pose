package com.camera.mlkit;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class NativeMLKitModule extends ReactContextBaseJavaModule {

    NativeMLKitModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "NativeMLKitModule";
    }

    @ReactMethod
    public void getPackageName(Callback callback, Callback error) {
        try{
            callback.invoke("NativeMLKitModule");
        } catch (Exception e){
            error.invoke(e.getMessage());
            e.printStackTrace();
        }
    }

}
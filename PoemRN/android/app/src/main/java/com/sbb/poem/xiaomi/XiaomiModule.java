package com.sbb.poem.xiaomi;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

//import com.bbs.beernotes.youmi.YoumiAdActivity;

public class XiaomiModule extends ReactContextBaseJavaModule {

    public static final String REACTCLASSNAME = "XiaomiModule";

    private Context mContext;

    public XiaomiModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return REACTCLASSNAME;
    }

    @ReactMethod
    public void startXiaomiAdActivity(){
        try{
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){
//                Class aimActivity = Class.forName(name);
                Intent intent = new Intent(currentActivity,XiaomiAdActivity.class);
                currentActivity.startActivity(intent);
            }
        }catch(Exception e){

            throw new JSApplicationIllegalArgumentException(
                    "无法打开activity页面: "+e.getMessage());
        }
    }
}

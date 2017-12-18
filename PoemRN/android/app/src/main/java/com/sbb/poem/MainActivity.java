package com.sbb.poem;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.sbb.poem.invokenative.ShareModule;
import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.UMShareAPI;

import org.devio.rn.splashscreen.SplashScreen;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        SplashScreen.show(this);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);
        ShareModule.initSocialSDK(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
        MobclickAgent.onResume(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PoemRN";
    }


}

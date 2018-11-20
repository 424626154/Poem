package com.sbb.poem.xiaomi;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.miui.zeus.mimo.sdk.ad.AdWorkerFactory;
import com.miui.zeus.mimo.sdk.ad.IAdWorker;
import com.miui.zeus.mimo.sdk.listener.MimoAdListener;
import com.sbb.poem.R;
import com.xiaomi.ad.common.pojo.AdType;

public class XiaomiAdActivity extends Activity {

    private static final String POSITION_ID = "8717bfd9a8acee53c718fe5da5c89aec";

    public static final String TAG = "------Xiaomi";

    private RelativeLayout rl_ad;

    private ImageView iv_app_icon;

    private TextView tv_app_name;

    private TextView tv_go;

    private TextView tv_timer;

    private Context mContext;

    private IAdWorker mWorker;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_xiaomi_ad);
        mContext = this;
        rl_ad = findViewById(R.id.rl_ad);
        iv_app_icon = findViewById(R.id.iv_app_icon);
        tv_app_name = findViewById(R.id.tv_app_name);
        tv_go = findViewById(R.id.tv_go);
        tv_timer = findViewById(R.id.tv_timer);
        tv_go.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        iv_app_icon.setImageBitmap(getBitmap(this));
        tv_app_name.setText(getAppName(this));
        setupNativeSpotAd();
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            // 捕获back键，在展示广告期间按back键，不跳过广告
            if (rl_ad.getVisibility() == View.VISIBLE) {
                return true;
            }
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    protected void onDestroy() {
        try {
            super.onDestroy();
            mWorker.recycle();
        } catch (Exception e) {
        }
    }

    public void setupNativeSpotAd(){
        try {
            mWorker = AdWorkerFactory.getAdWorker(this, rl_ad, new MimoAdListener() {
                @Override
                public void onAdPresent() {
                    // 开屏广告展示
                    Log.d(TAG, "onAdPresent");
                }

                @Override
                public void onAdClick() {
                    //用户点击了开屏广告
                    Log.d(TAG, "onAdClick");
                }

                @Override
                public void onAdDismissed() {
                    //这个方法被调用时，表示从开屏广告消失。
                    Log.d(TAG, "onAdDismissed");
                    finish();
                }

                @Override
                public void onAdFailed(String s) {
                    Log.e(TAG, "ad fail message : " + s);
                    finish();
                }

                @Override
                public void onAdLoaded(int size) {
                    //do nothing
                }

                @Override
                public void onStimulateSuccess() {
                }
            }, AdType.AD_SPLASH);

            mWorker.loadAndShow(POSITION_ID);
        } catch (Exception e) {
            e.printStackTrace();
            rl_ad.setVisibility(View.GONE);
        }
    }

    /**
     * 获取应用程序名称
     */
    public static synchronized String getAppName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    context.getPackageName(), 0);
            int labelRes = packageInfo.applicationInfo.labelRes;
            return context.getResources().getString(labelRes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取图标 bitmap
     * @param context
     */
    public static synchronized Bitmap getBitmap(Context context) {
        PackageManager packageManager = null;
        ApplicationInfo applicationInfo = null;
        try {
            packageManager = context.getApplicationContext()
                    .getPackageManager();
            applicationInfo = packageManager.getApplicationInfo(
                    context.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            applicationInfo = null;
        }
        Drawable d = packageManager.getApplicationIcon(applicationInfo); //xxx根据自己的情况获取drawable
        BitmapDrawable bd = (BitmapDrawable) d;
        Bitmap bm = bd.getBitmap();
        return bm;
    }
}

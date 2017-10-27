package com.sbb.poem;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new SplashScreenReactPackage(),
            new RNFetchBlobPackage(),
            new PickerPackage(),
            new WebViewBridgePackage(),
            new SQLitePluginPackage(),
            new VectorIconsPackage(),
              new JPushPackage(true,false)//第一个参数设置为 true 表示关闭 toast 提示，第二个设置为 true 表示关闭日志打印，建议在 debug 版本中打开
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

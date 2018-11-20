package com.sbb.poem;

import android.app.Application;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.text.TextUtils;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.sbb.poem.invokenative.DplusReactPackage;
import com.sbb.poem.invokenative.RNUMConfigure;
import com.sbb.poem.xiaomi.XiaomiReactPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;
import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication {
  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = false;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = false;

  public static String um_appkey = "5a2146eb8f4a9d2dd800024f";

//  public static String um_channel = "frim.im";
  public static String um_channel = "xiaomi";



  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {


    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewShotPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new PickerPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new SplashScreenReactPackage(),
            new DplusReactPackage(),
            new XiaomiReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
    UMConfigure.setLogEnabled(true);
    RNUMConfigure.init(this, um_appkey, um_channel, UMConfigure.DEVICE_TYPE_PHONE,
            "");
//    Log.i("getDeviceInfo", getDeviceInfo(this));
//    System.out.print("getDeviceInfo");
//    System.out.print(getDeviceInfo(this));
  }


  public static boolean checkPermission(Context context, String permission) {
    boolean result = false;
    if (Build.VERSION.SDK_INT >= 23) {
      try {
        Class<?> clazz = Class.forName("android.content.Context");
        Method method = clazz.getMethod("checkSelfPermission", String.class);
        int rest = (Integer) method.invoke(context, permission);
        if (rest == PackageManager.PERMISSION_GRANTED) {
          result = true;
        } else {
          result = false;
        }
      } catch (Exception e) {
        result = false;
      }
    } else {
      PackageManager pm = context.getPackageManager();
      if (pm.checkPermission(permission, context.getPackageName()) == PackageManager.PERMISSION_GRANTED) {
        result = true;
      }
    }
    return result;
  }
  public static String getDeviceInfo(Context context) {
    try {
      org.json.JSONObject json = new org.json.JSONObject();
      android.telephony.TelephonyManager tm = (android.telephony.TelephonyManager) context
              .getSystemService(Context.TELEPHONY_SERVICE);
      String device_id = null;
      if (checkPermission(context, android.Manifest.permission.READ_PHONE_STATE)) {
        device_id = tm.getDeviceId();
      }
      String mac = null;
      FileReader fstream = null;
      try {
        fstream = new FileReader("/sys/class/net/wlan0/address");
      } catch (FileNotFoundException e) {
        fstream = new FileReader("/sys/class/net/eth0/address");
      }
      BufferedReader in = null;
      if (fstream != null) {
        try {
          in = new BufferedReader(fstream, 1024);
          mac = in.readLine();
        } catch (IOException e) {
        } finally {
          if (fstream != null) {
            try {
              fstream.close();
            } catch (IOException e) {
              e.printStackTrace();
            }
          }
          if (in != null) {
            try {
              in.close();
            } catch (IOException e) {
              e.printStackTrace();
            }
          }
        }
      }
      json.put("mac", mac);
      if (TextUtils.isEmpty(device_id)) {
        device_id = mac;
      }
      if (TextUtils.isEmpty(device_id)) {
        device_id = android.provider.Settings.Secure.getString(context.getContentResolver(),
                android.provider.Settings.Secure.ANDROID_ID);
      }
      json.put("device_id", device_id);
      return json.toString();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  {
    PlatformConfig.setWeixin("wx178d9f6300316fd1", "4c4743ed7f4caf6dd80870eb5acf9c7c");
    PlatformConfig.setQQZone("1106540600", "qlZjCQ25ec2bbhby");
    PlatformConfig.setSinaWeibo("1444689788", "1b4994a8f185b77d00cd7d9d1f61b96d", "http://sns.whalecloud.com");
  }
}

package com.flatlogic.dsma;

import android.app.Application;

import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.reactnative.camera.RNCameraPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.imagepicker.ImagePickerPackage;
import com.terrylinla.rnsketchcanvas.SketchCanvasPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

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
            new RNFSPackage(),
            new AsyncStoragePackage(),
            new RNCameraPackage(),
            new RNLocationPackage(),
            new GeolocationPackage(),
            new ImagePickerPackage(),
            new SketchCanvasPackage(),
            new RCTPdfView(),
            new RNFetchBlobPackage(),
            new NetInfoPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new CameraRollPackage()
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
  }
}

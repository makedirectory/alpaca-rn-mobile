package app.alpaca.markets;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class AlpacaOAuth extends ReactContextBaseJavaModule {
    public AlpacaOAuth(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void AuthStart(
            String url,
            Promise promise) {
        ReactApplicationContext context = getReactApplicationContext();
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        context.startActivity(browserIntent);
        promise.resolve(url);
    }

    @Override
    public String getName() {
        return "AlpacaOAuth";
    }
}

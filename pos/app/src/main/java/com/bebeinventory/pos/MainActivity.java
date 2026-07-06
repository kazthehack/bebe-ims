package com.bebeinventory.pos;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class MainActivity extends Activity implements PrinterServiceClient.Listener {
    private static final int CAMERA_PERMISSION_REQUEST = 1001;
    private static final String SCANNER_ACTION = "android.scanner.scan";
    private static final Set<String> ALLOWED_HOSTS = new HashSet<>(
        Arrays.asList(BuildConfig.ALLOWED_WEB_POS_HOSTS.split(","))
    );

    private WebView webView;
    private PrinterServiceClient printerClient;
    private PermissionRequest pendingCameraPermissionRequest;
    private boolean scannerReceiverRegistered;

    private final BroadcastReceiver scannerReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent == null || !SCANNER_ACTION.equals(intent.getAction())) {
                return;
            }
            String code = resolveScanResult(intent);
            dispatchScan(code);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
        setContentView(R.layout.activity_main);

        printerClient = new PrinterServiceClient(this, this);
        printerClient.bind();
        configureWebView();
        registerScannerReceiver();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (printerClient != null) {
            printerClient.bind();
            dispatchHardwareStatus();
        }
    }

    @Override
    protected void onDestroy() {
        unregisterScannerReceiver();
        if (printerClient != null) {
            printerClient.unbind();
        }
        if (webView != null) {
            webView.removeJavascriptInterface("BebeHardware");
            webView.destroy();
        }
        super.onDestroy();
    }

    @Override
    public void onPrinterStatusChanged() {
        dispatchHardwareStatus();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != CAMERA_PERMISSION_REQUEST || pendingCameraPermissionRequest == null) {
            return;
        }

        PermissionRequest request = pendingCameraPermissionRequest;
        pendingCameraPermissionRequest = null;
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (granted) {
            request.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
        } else {
            request.deny();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        webView = findViewById(R.id.web_pos_view);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return shouldBlockUrl(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                return shouldBlockUrl(request == null || request.getUrl() == null ? "" : request.getUrl().toString());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                dispatchHardwareStatus();
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (request == null || !requestsVideoCapture(request)) {
                    if (request != null) request.deny();
                    return;
                }
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M
                    || checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    request.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
                    return;
                }

                pendingCameraPermissionRequest = request;
                requestPermissions(new String[] { Manifest.permission.CAMERA }, CAMERA_PERMISSION_REQUEST);
            }
        });
        webView.addJavascriptInterface(new HardwareBridge(printerClient), "BebeHardware");
        webView.loadUrl(BuildConfig.WEB_POS_URL);
    }

    private void registerScannerReceiver() {
        if (scannerReceiverRegistered) {
            return;
        }
        IntentFilter filter = new IntentFilter(SCANNER_ACTION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(scannerReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(scannerReceiver, filter);
        }
        scannerReceiverRegistered = true;
    }

    private void unregisterScannerReceiver() {
        if (!scannerReceiverRegistered) {
            return;
        }
        try {
            unregisterReceiver(scannerReceiver);
        } catch (RuntimeException ignored) {
            // Receiver lifecycle can vary while iterating from Android Studio.
        } finally {
            scannerReceiverRegistered = false;
        }
    }

    private void dispatchScan(String rawCode) {
        String code = rawCode == null ? "" : rawCode.trim();
        if (code.isEmpty() || webView == null) {
            return;
        }

        String script = "window.dispatchEvent(new CustomEvent('bebe:scan', { detail: { code: "
            + quoteJs(code)
            + " } }));";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private static String resolveScanResult(Intent intent) {
        String code = intent.getStringExtra("result");
        if (code != null && !code.trim().isEmpty()) {
            return code;
        }

        String[] fallbackKeys = new String[] { "barcode", "scan_result", "data", "value" };
        for (String key : fallbackKeys) {
            code = intent.getStringExtra(key);
            if (code != null && !code.trim().isEmpty()) {
                return code;
            }
        }

        Bundle extras = intent.getExtras();
        if (extras == null) {
            return "";
        }
        for (String key : extras.keySet()) {
            Object value = extras.get(key);
            if (value instanceof String && !((String) value).trim().isEmpty()) {
                return (String) value;
            }
        }
        return "";
    }

    private void dispatchHardwareStatus() {
        if (webView == null) {
            return;
        }
        String printerStatus = printerClient == null
            ? "{\"connected\":false,\"status\":\"unavailable\"}"
            : printerClient.statusJson();
        String script = "window.dispatchEvent(new CustomEvent('bebe:hardware-status', { detail: { "
            + "platform: 'android', "
            + "printer: "
            + printerStatus
            + ", scanner: { available: true, mode: 'broadcast' }"
            + " } }));";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private static boolean shouldBlockUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            return true;
        }
        Uri uri = Uri.parse(rawUrl);
        String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
        String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase();
        if (!"https".equals(scheme)) {
            return true;
        }
        return !ALLOWED_HOSTS.contains(host);
    }

    private static boolean requestsVideoCapture(PermissionRequest request) {
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) {
                return true;
            }
        }
        return false;
    }

    private static String quoteJs(String value) {
        return "'"
            + value
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
            + "'";
    }
}

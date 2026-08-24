# Bebe POS Android Shell

Hybrid Android container for the Bebe Web POS.

The app loads the Web POS URL configured in `pos/app/build.gradle`:

```text
https://bebeinventory.net/web-pos
```

Native responsibilities:

- bind the Soonpos printer service through `PrinterInterface.aidl`
- expose a small `window.BebeHardware` JavaScript bridge
- receive Soonpos scanner broadcasts from `android.scanner.scan`
- forward scan events into the Web POS page
- keep WebView navigation pinned to `bebeinventory.net`
- request Android camera permission for the existing browser camera scanner fallback

The Web POS remains the source of truth for auth, cart, checkout, receipt creation, inventory rules, and RBAC.

## POS Runtime Cache

The Web POS uses WebView/local browser storage as the POS catalog cache. On POS-user login, the app preloads product, product variant, and product-line listings into that cache. The Web POS hydrates its menu from the cached catalog first, then refreshes the cache when needed.

Cached data is used for display and scan lookup only:

- product names
- product variants
- SKUs
- QR codes
- product lines/categories
- prices/display metadata

Inventory counts, receipt creation, and stock deduction remain backend-authoritative. Scanning a QR adds an item to the in-progress cart only; the sale is created at checkout.

Use `REFRESH MENU` in Web POS to refresh the cached catalog and the current site stock snapshot without clearing the cart.

## Build

From `pos/`:

```bash
make
```

This runs the Android debug APK build when Gradle and Android SDK tooling are available.

If the command reports missing Gradle or Android SDK paths, open `pos/` in Android Studio, sync Gradle, then run the `app` configuration on the Soonpos device. Android Studio will install/manage the required SDK packages.

The emulator can validate WebView loading and bridge presence, but printer/scanner validation requires the physical Soonpos device and its vendor services.

For a staging or local Web POS target, update these fields in `pos/app/build.gradle` before building:

```gradle
buildConfigField "String", "WEB_POS_URL", "\"https://bebeinventory.net/web-pos\""
buildConfigField "String", "ALLOWED_WEB_POS_HOSTS", "\"bebeinventory.net,www.bebeinventory.net\""
```

The shell blocks non-HTTPS and off-domain WebView navigation.

## JavaScript Bridge

The WebView exposes:

```js
window.BebeHardware.getCapabilities()
window.BebeHardware.getPrinterStatus()
window.BebeHardware.printText("hello")
window.BebeHardware.printReceipt(JSON.stringify(receiptPayload))
```

Scanner broadcasts are forwarded to the Web POS as:

```js
window.dispatchEvent(new CustomEvent("bebe:scan", {
  detail: { code: "..." }
}))
```

Hardware status is forwarded as:

```js
window.dispatchEvent(new CustomEvent("bebe:hardware-status", {
  detail: {
    platform: "android",
    printer: { connected: true, status: "connected" },
    scanner: { available: true, mode: "broadcast" }
  }
}))
```

See `TEST_PLAN.md` for the device validation checklist.

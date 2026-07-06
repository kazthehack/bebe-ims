# Bebe POS Android Shell Test Plan

## Android Studio Smoke

1. Open `pos/` in Android Studio.
2. Sync Gradle.
3. Build the `app` debug variant.
4. Install and run on the Soonpos device.
5. Confirm the first screen loads `https://bebeinventory.net/web-pos`.
6. Confirm login and POS navigation still behave like the normal web app.

## Bridge Smoke

Open WebView inspection from Chrome DevTools while the debug build is running and check:

```js
typeof window.BebeHardware
window.BebeHardware.getCapabilities()
window.BebeHardware.getPrinterStatus()
```

Expected:

- `window.BebeHardware` is an object.
- capabilities reports Android, printer, and scanner support.
- printer status returns connected once the vendor service is bound.

## Printer

1. Log in as a POS-capable user.
2. Open a register.
3. Add an item to cart.
4. Check out.
5. Confirm the backend receipt is created.
6. Confirm the paper receipt prints with receipt number, site, payment method, items, SKU, subtotal, discount when present, total, and footer.
7. Disable or stop the vendor printer service if possible, then repeat checkout.
8. Confirm checkout still completes and the POS shows a non-blocking print failure notice.

## Scanner

1. Open a register.
2. Use the Soonpos hardware scanner on a known variant QR/barcode.
3. Confirm the item is added to cart through the `bebe:scan` event.
4. Scan an unknown code.
5. Confirm the POS shows the existing QR-not-found message.

## Web Fallback

1. Open the same Web POS route in a normal desktop or mobile browser.
2. Confirm no printer status pill is shown.
3. Confirm checkout still creates receipts without trying native printing.
4. Confirm camera scan fallback still uses browser camera APIs.

## Release Notes

- Release APK/AAB signing is not configured yet.
- Device validation must be done on a real Soonpos terminal because the emulator cannot provide the vendor AIDL printer service or scanner broadcast app.

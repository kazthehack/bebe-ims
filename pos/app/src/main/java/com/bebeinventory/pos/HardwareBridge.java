package com.bebeinventory.pos;

import android.webkit.JavascriptInterface;

public class HardwareBridge {
    private final PrinterServiceClient printerClient;

    public HardwareBridge(PrinterServiceClient printerClient) {
        this.printerClient = printerClient;
    }

    @JavascriptInterface
    public String getCapabilities() {
        return "{\"platform\":\"android\",\"printer\":true,\"scanner\":true,\"nfc\":false}";
    }

    @JavascriptInterface
    public String getPrinterStatus() {
        return printerClient.statusJson();
    }

    @JavascriptInterface
    public String printText(String text) {
        try {
            boolean printed = printerClient.printText(text == null ? "" : text);
            return printed ? okJson() : errorJson("printer_unavailable", "Printer service is not connected.");
        } catch (Exception error) {
            return errorJson("print_failed", error.getMessage());
        }
    }

    @JavascriptInterface
    public String printReceipt(String receiptJson) {
        try {
            ReceiptPrintPayload receipt = ReceiptPrintPayload.fromJson(receiptJson);
            boolean printed = printerClient.printReceipt(receipt);
            return printed ? okJson() : errorJson("printer_unavailable", "Printer service is not connected.");
        } catch (Exception error) {
            return errorJson("print_failed", error.getMessage());
        }
    }

    private static String okJson() {
        return "{\"ok\":true}";
    }

    private static String errorJson(String code, String message) {
        return "{\"ok\":false,\"code\":\""
            + PrinterServiceClient.escapeJson(code)
            + "\",\"message\":\""
            + PrinterServiceClient.escapeJson(message)
            + "\"}";
    }
}

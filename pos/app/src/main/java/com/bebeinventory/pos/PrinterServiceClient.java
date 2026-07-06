package com.bebeinventory.pos;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;

import recieptservice.com.recieptservice.PrinterInterface;

public class PrinterServiceClient {
    private static final String PRINTER_PACKAGE = "recieptservice.com.recieptservice";
    private static final String PRINTER_SERVICE = "recieptservice.com.recieptservice.service.PrinterService";

    private final Context context;
    private final Listener listener;
    private PrinterInterface printer;
    private boolean binding;

    public interface Listener {
        void onPrinterStatusChanged();
    }

    private final ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            printer = PrinterInterface.Stub.asInterface(service);
            binding = false;
            notifyStatusChanged();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            printer = null;
            binding = false;
            notifyStatusChanged();
        }
    };

    public PrinterServiceClient(Context context, Listener listener) {
        this.context = context.getApplicationContext();
        this.listener = listener;
    }

    public synchronized boolean bind() {
        if (printer != null || binding) {
            return true;
        }

        Intent intent = new Intent();
        intent.setClassName(PRINTER_PACKAGE, PRINTER_SERVICE);
        binding = true;
        try {
            boolean bound = context.bindService(intent, connection, Context.BIND_AUTO_CREATE);
            if (!bound) {
                binding = false;
            }
            return bound;
        } catch (RuntimeException error) {
            binding = false;
            return false;
        }
    }

    public synchronized void unbind() {
        if (printer == null && !binding) {
            return;
        }

        try {
            context.unbindService(connection);
        } catch (RuntimeException ignored) {
            // The vendor service may not have been bound on emulator/browser-only tests.
        } finally {
            printer = null;
            binding = false;
            notifyStatusChanged();
        }
    }

    public boolean isConnected() {
        return printer != null;
    }

    public String statusJson() {
        if (printer == null) {
            bind();
            return "{\"connected\":false,\"status\":\"disconnected\"}";
        }

        try {
            String version = escapeJson(printer.getServiceVersion());
            return "{\"connected\":true,\"status\":\"connected\",\"version\":\"" + version + "\"}";
        } catch (RemoteException error) {
            return "{\"connected\":false,\"status\":\"error\",\"message\":\"" + escapeJson(error.getMessage()) + "\"}";
        }
    }

    public boolean printText(String text) throws RemoteException {
        if (printer == null && !bind()) {
            return false;
        }
        if (printer == null) {
            return false;
        }

        printer.printText(text == null ? "" : text);
        return true;
    }

    public boolean printReceipt(ReceiptPrintPayload receipt) throws RemoteException {
        if (printer == null && !bind()) {
            return false;
        }
        if (printer == null) {
            return false;
        }

        printer.beginWork();
        printer.setCode("UTF-8");
        printer.setAlignment(1);
        printer.setTextBold(true);
        printer.setTextSize(28f);
        printer.printText("Bebe Inventory\n");
        printer.setTextSize(22f);
        printer.setTextBold(false);
        printer.printText("Receipt\n");
        printer.nextLine(1);

        printer.setAlignment(0);
        printer.setTextSize(20f);
        printer.printText("Site: " + receipt.siteId + "\n");
        printer.printText("Payment: " + receipt.paymentMethod + "\n");
        printer.printText("Receipt: " + receipt.receiptNumber + "\n");
        printer.printText("--------------------------------\n");

        for (ReceiptPrintPayload.Item item : receipt.items) {
            printer.printText(item.name + "\n");
            if (!item.sku.isEmpty()) {
                printer.printText("SKU: " + item.sku + "\n");
            }
            printer.printTableText(
                new String[] { "x" + item.qty, item.unitPrice, item.lineTotal },
                new int[] { 1, 1, 1 },
                new int[] { 0, 1, 2 }
            );
        }

        printer.printText("--------------------------------\n");
        printer.printTableText(
            new String[] { "Subtotal", "", receipt.subtotal },
            new int[] { 2, 1, 1 },
            new int[] { 0, 1, 2 }
        );
        if (!"0.00".equals(receipt.discount)) {
            printer.printTableText(
                new String[] { "Discount", "", receipt.discount },
                new int[] { 2, 1, 1 },
                new int[] { 0, 1, 2 }
            );
        }
        printer.setTextBold(true);
        printer.printTableText(
            new String[] { "Total", "", receipt.total },
            new int[] { 2, 1, 1 },
            new int[] { 0, 1, 2 }
        );
        printer.setTextBold(false);
        printer.nextLine(2);
        printer.setAlignment(1);
        printer.printText("Thank you!\n");
        printer.nextLine(3);
        printer.endWork();
        return true;
    }

    private void notifyStatusChanged() {
        if (listener != null) {
            listener.onPrinterStatusChanged();
        }
    }

    static String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r");
    }
}

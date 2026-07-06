package com.bebeinventory.pos;

import org.json.JSONArray;
import org.json.JSONObject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class ReceiptPrintPayload {
    public static class Item {
        public final String name;
        public final String sku;
        public final int qty;
        public final String unitPrice;
        public final String lineTotal;

        Item(String name, String sku, int qty, BigDecimal unitPrice) {
            this.name = safe(name, "Item");
            this.sku = safe(sku, "");
            this.qty = Math.max(1, qty);
            this.unitPrice = money(unitPrice);
            this.lineTotal = money(unitPrice.multiply(BigDecimal.valueOf(this.qty)));
        }
    }

    public final String receiptNumber;
    public final String siteId;
    public final String paymentMethod;
    public final String subtotal;
    public final String discount;
    public final String total;
    public final List<Item> items;

    private ReceiptPrintPayload(
        String receiptNumber,
        String siteId,
        String paymentMethod,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal total,
        List<Item> items
    ) {
        this.receiptNumber = safe(receiptNumber, "Pending");
        this.siteId = safe(siteId, "N/A");
        this.paymentMethod = safe(paymentMethod, "N/A");
        this.subtotal = money(subtotal);
        this.discount = money(discount);
        this.total = money(total);
        this.items = items;
    }

    public static ReceiptPrintPayload fromJson(String json) throws Exception {
        JSONObject root = new JSONObject(json == null ? "{}" : json);
        JSONArray rawItems = root.optJSONArray("items");
        List<Item> parsedItems = new ArrayList<>();
        BigDecimal computedSubtotal = BigDecimal.ZERO;

        if (rawItems != null) {
            for (int index = 0; index < rawItems.length(); index += 1) {
                JSONObject rawItem = rawItems.optJSONObject(index);
                if (rawItem == null) {
                    continue;
                }
                int qty = Math.max(1, rawItem.optInt("qty", 1));
                BigDecimal unitPrice = decimal(rawItem.opt("unit_price"));
                parsedItems.add(new Item(rawItem.optString("name", "Item"), rawItem.optString("sku", ""), qty, unitPrice));
                computedSubtotal = computedSubtotal.add(unitPrice.multiply(BigDecimal.valueOf(qty)));
            }
        }

        BigDecimal subtotal = root.has("subtotal") ? decimal(root.opt("subtotal")) : computedSubtotal;
        BigDecimal discount = decimal(root.opt("discount_amount"));
        BigDecimal total = root.has("total") ? decimal(root.opt("total")) : subtotal.subtract(discount);

        return new ReceiptPrintPayload(
            root.optString("receipt_number", ""),
            root.optString("site_id", ""),
            root.optString("payment_method", ""),
            subtotal,
            discount,
            total,
            parsedItems
        );
    }

    private static BigDecimal decimal(Object value) {
        if (value == null || JSONObject.NULL.equals(value)) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(String.valueOf(value)).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException error) {
            return BigDecimal.ZERO;
        }
    }

    private static String money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private static String safe(String value, String fallback) {
        String cleaned = value == null ? "" : value.trim();
        return cleaned.isEmpty() ? fallback : cleaned;
    }
}

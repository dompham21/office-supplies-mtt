package com.luv2code.doan.bean;

import java.util.ArrayList;
import java.util.List;

public class ReasonCancelOrder {
    public static final String REASON_PRODUCT = "Muốn thay đổi sản phẩm";
    public static final String REASON_SERVICE = "Tìm thấy chỗ mua khác tốt hơn";
    public static final String REASON_NO_NEED = "Không có nhu cầu mua nữa";
    public static final String REASON_SHIPPING_FEE = "Phí vận chuyển cao";
    public static final String REASON_OTHER = "Khác";

    public List<String> getListReasonCancel() {
        List<String> listReason = new ArrayList<>();
        listReason.add(REASON_PRODUCT);
        listReason.add(REASON_SERVICE);
        listReason.add(REASON_NO_NEED);
        listReason.add(REASON_SHIPPING_FEE);
        listReason.add(REASON_OTHER);
        return listReason;
    }
}

package com.luv2code.doan.utils;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


public class MessageErrorMap {
    public static final String NAME_NOT_BLANK = "Vui lòng nhập họ và tên!";
    public static final String NAME_MAX_LENGTH = "Họ và tên không quá 50 ký tự!";
    public static final String GENDER_NOT_BLANK = "Vui lòng chọn giới tính!";
    public static final String GENDER_MAX_LENGTH = "Giới tính không quá 3 ký tự!";
    public static final String BIRTHDAY_NOT_NULL = "Vui lòng chọn ngày sinh!";
    public static final String ADDRESS_NOT_BLANK = "Vui lòng nhập địa chỉ!";
    public static final  String PHONE_NOT_BLANK ="Vui lòng nhập số điện thoại!";
    public static final  String PHONE_MAX_LENGTH ="Số điện thoại không quá 11 kí số!";
    public static final  String EMAIL_NOT_BLANK ="Vui lòng nhập Email!";
    public static final  String EMAIL_INVALID_FORMAT ="Email chưa đúng định dạng!";
    public static final  String EMAIL_MAX_LENGTH="Email không quá 64 kí tự!";

    public static final  String PASSWORD_NOT_BLANK ="Vui lòng nhập password!";
    public static final  String PASSWORD_MAX_LENGTH="Email không quá 100 kí tự!";
    public static final  String PASSWORD_MIN_LENGTH="Email không nhỏ 3 kí tự!";

    public static final String HAS_NOT_PERMISSION_DONE_ORDER = "Đơn hàng này không phải bạn giao nên không thể hoàn tất!";

    public static final String INVALID_FORMAT_DATETIME="Lỗi định dạng datetime!";

    public static final String DUPLICATE_EMAIL = "Địa chỉ email này đã tồn tại!";

}

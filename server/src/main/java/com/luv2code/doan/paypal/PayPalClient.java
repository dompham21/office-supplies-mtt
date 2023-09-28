package com.luv2code.doan.paypal;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PayPalClient {

    String clientId = "AVyQcnjtaDpmchNOWtYdW_mXOwYQz0caeABmOinsCmCG_ZAikhgekoMRbmgJYMw8u717Wys-gWiPSKYk";
    String clientSecret = "EHTBWmbtFmrtJ4oqv4SyRyIwTfT_3hcuf4JrBazyopnsoEb1NFrw7Z2lvClXs64I0vTnvPZI1bEHK1Lx";
}
import React from 'react'
import { useExecutePayment } from '@data/checkout/use-execute-payment.query'
import getLayout from '@components/layouts/layouts';
import { Spin } from 'antd';



export default function CheckoutSuccess() {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('paymentId');
    const PayerID = params.get('PayerID');

    const { data, isLoading, isError } = useExecutePayment({paymentId, PayerID})

    if(isLoading) return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Spin size="large"/>
        </div>
    )

    
   
    return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Spin size="large"/>
        </div>
    )
}



CheckoutSuccess.authenticate = {
  permissions: ["USER"],
};

CheckoutSuccess.Layout = getLayout;

import { currencyMoney } from '@utils/format-currency';
import { convertToVietnameseDate } from '@utils/format-date';
import { Button, Table } from 'antd';
import React, { Fragment, useRef } from 'react'
import ReactToPrint from 'react-to-print';

const columns = [
    {
        title: 'STT',
        dataIndex: 'key',
        align: 'center',
        render: (text, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product',
      align: 'left',
      render: (product) => <div>{product?.name}</div>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      align: 'center',
      render: (text) => <div>{currencyMoney(text)}</div>,
    },
    {
        title: 'Thành tiền',
        dataIndex: 'subtotal',
        align: 'right',
        render: (text, record) => <div>{currencyMoney(record?.quantity * record?.unitPrice)}</div>,
    },
  ];

function PrintInvoice({invoice}) {
    const componentRef = useRef();

    const getPageMargins = () => {
        return `@page { margin: 1.5cm 0 1.5cm 0 !important} `;
    };
  return (
    <Fragment>
        <div className='flex justify-end items-center'>
            <ReactToPrint
                trigger={() => <Button type='primary'>In hoá đơn</Button>}
                content={() => componentRef.current}
            >
            </ReactToPrint>
        </div>
        <div ref={componentRef} className='text-base px-2'>
            <style>{getPageMargins()}</style>
            <div className='py-2 flex justify-center items-center font-bold'>HOÁ ĐƠN BÁN HÀNG</div>
            <div className='flex justify-end mr-8 gap-1'>Mã:<span className='font-semibold'>{invoice?.id?.trim()}</span></div>
            <div className='p-8'>
                <div>Tên người bán: <span className=' font-semibold'>CÔNG TY TNHH PickBazar</span></div>
                <div>Mã số thuế: <span className=' font-semibold'>0314830587</span></div>
                <div>Email: <span className=' font-semibold'>support@pickbazar.com</span></div>
                <div>Địa chỉ: <span className=' font-semibold'>97 Man Thiện, Quận 9, Thành phố Hồ Chí Minh</span></div>

                <div className='mt-4'>Tên người mua: <span className=' font-semibold'>{invoice?.name}</span></div>
                <div>Mã số thuế: <span className=' font-semibold'>{invoice?.taxCode}</span></div>
                <div>Hình thức thanh toán: <span className=' font-semibold'>Paypal</span></div>
                <div>Địa chỉ: <span className='font-semibold'>{invoice?.order?.address}</span></div>
            </div>
            <div className='px-2'>
                <Table
                    columns={columns}
                    dataSource={invoice?.order?.orderDetails}
                    bordered
                    pagination={false}
                />
            </div>
            <div className='m-2 flex justify-start gap-1'>Tổng tiền thanh toán:<span className='font-semibold'>{currencyMoney(invoice?.order?.totalPrice)}</span></div>
            <div className='flex flex-col items-end mr-14 mt-4'>
                <div className='flex flex-col items-center'>
                    <div className='italic'>Thành phố Hồ Chí Minh, {convertToVietnameseDate(invoice?.date)}</div>
                    <div>Nhân viên lập hoá đơn</div>
                    <div className='mt-1'>{invoice?.staff?.name}</div>
                </div>
                
            </div>
           
        </div>
        
    </Fragment>
  )
}

export default PrintInvoice
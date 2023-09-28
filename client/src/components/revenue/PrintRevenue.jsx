import { useProfileAdminQuery } from '@data/profile/use-profile-admin.query';
import { currencyMoney } from '@utils/format-currency';
import { convertToVietnameseDate } from '@utils/format-date';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import { Button, Table } from 'antd';
import dayjs from 'dayjs';
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
    title: 'Thời gian',
    dataIndex: 'month',
    align: 'left',
    render: (value) => <div>{value}</div>,
  },
  {
    title: 'Doanh thu',
    dataIndex: 'total',
    align: 'right',
    render: (value) => <div>{value === 0 ? "₫0" : currencyMoney(value)}</div>,
  }
];


function PrintRevenue({revenue, fromDate, toDate}) {
  const componentRef = useRef();
  const { data, isLoading: loading, error } = useProfileAdminQuery();

    const getPageMargins = () => {
        return `@page { margin: 1.5cm 0 1.5cm 0 !important} `;
    };

    const calTotal = () => {
      let total = 0;
      revenue?.map(item => {
        total += item?.total
      })
      return total
    }

    console.log(fromDate)
  return (
    <Fragment>
      <div className='flex justify-end items-center'>
        <ReactToPrint
          trigger={() => <Button type='primary'>In báo cáo</Button>}
          content={() => componentRef.current}
        >
        </ReactToPrint>
      </div>
     
      <div ref={componentRef} className='text-base px-2 ml-2'>
        <style>{getPageMargins()}</style>
        <div className='px-2 text-lg font-bold'>Công ty TNHH PickBazar</div>
        <div className='py-2 flex justify-center items-center font-bold'>BÁO CÁO DOANH THU THEO THÁNG</div>
        <div className='flex justify-center items-center'>Từ ngày {fromDate} đến ngày {toDate}</div>
        <div className='px-2 mt-4'>
            <Table
              columns={columns}
              dataSource={revenue}
              bordered
              pagination={false}
            />
        </div>
        <div className='m-2 flex justify-start gap-1'>Tổng tiền doanh thu:<span className='font-semibold'>{currencyMoney(calTotal())}</span></div>
        <div className='flex flex-col items-end mr-14 mt-4'>
            <div className='flex flex-col items-center'>
                <div className='italic'>Thành phố Hồ Chí Minh, {convertToVietnameseDate(dayjs())}</div>
                <div>Nhân viên lập báo cáo</div>
                <div className='mt-1'>{data?.user?.name}</div>

            </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PrintRevenue
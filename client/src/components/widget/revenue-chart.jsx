import Chart from '@components/ui/chart';
import React, { useRef, useState } from 'react'
import cn from "classnames";
import ArrowUpIcons from '@components/icons/arrow-up-icons';
import ArrowDownIcons from '@components/icons/arrow-down-icons';
import { useSaleHistoryQuery } from '@data/dashboard/use-sale-history.query';
import MoreIcons from '@components/icons/more-icons';
import { Button, Radio, Spin, Modal, DatePicker, Table } from 'antd';
import { currencyMoney } from '@utils/format-currency';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDatePicker } from '@utils/format-date-picker';
import customLocale from 'dayjs/locale/vi'
import locale from '@utils/locale-datepicker';
import { useRevenueBetweenQuery } from '@data/dashboard/use-revenue-between.query';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RevenuePdfFile from '@components/revenue/PrintRevenue';
import PrintRevenue from '@components/revenue/PrintRevenue';
import ReactToPrint from 'react-to-print';
import { convertToVietnameseDate } from '@utils/format-date';
import ModalRevenue from '@components/revenue/ModalRevenue';



const { RangePicker } = DatePicker;
function RevenueChart() {
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)

    const [open, setOpen] = useState(false);

    
    const disabledDate = (current) => {
      return current && current > dayjs().endOf('day');
    };

    const handleOnChange = (date, dateString) => {
      const filteredDates = dateString.filter(date => date !== null || date !== '');
      if (filteredDates.length >= 2) {
        setFromDate(dateString[0])
        setToDate(dateString[1])
      }
   }
   
    return (
        <div className="bg-light shadow-sm rounded w-full h-full p-8">
          <div className='flex items-center gap-4'>
            <div>
              <div className='my-4 font-semibold'>Chọn khoảng thời gian muốn báo cáo doanh thu theo tháng</div>
              <div className='flex items-center gap-2'>
                <RangePicker allowClear locale={locale} disabledDate={disabledDate} onChange={handleOnChange} format="DD/MM/YYYY" className='h-9'/>
                <Button type='primary' onClick={()=>setOpen(true)} disabled={!fromDate || !toDate}>In báo cáo</Button>
              </div>
            </div>
          </div>
          {open &&
          <ModalRevenue open={open} setOpen={setOpen} fromDate={fromDate} toDate={toDate}/>}
        </div>
    )
}

export default RevenueChart
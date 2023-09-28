import GetLayoutPageUser from '@components/layouts/layout_page_user'
import React, { useState } from 'react'
import { Tabs } from 'antd';
import OrderCard from '@components/order/order-card';
import ListOrderWithLoader from '@components/order/list-order-with-loader';
import ListOrder from '@components/order/list-order';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDatePicker } from '@utils/format-date-picker';
import Search from '@components/common/search';
import SearchOnChange from '@components/common/search-onchange';
import { useDebounce } from 'ahooks';
import locale from '@utils/locale-datepicker';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

export default function Order() {
  

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [keyword, setKeyword] = useState('');
  const debouncedValue = useDebounce(keyword.trim(), { wait: 300 });

  const handleOnChange = (date, dateString) => {
    const filteredDates = dateString.filter(date => date !== null || date !== '');
    if (filteredDates.length >= 2) {
        setFromDate(dateString[0])
        setToDate(dateString[1])
    }
  }

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  function handleSearch(e) {
    const { value } = e.target;
    setKeyword(value);
  }

  const handleClear = () => {
    setKeyword("")
  }


  const items = [
    {
      key: '0',
      label: `Tất cả`,
      children: <ListOrder type={0} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    },
    {
      key: '1',
      label: `Chờ thanh toán`,
      children: <ListOrder type={1} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    },
    {
      key: '2',
      label: `Chờ duyệt`,
      children: <ListOrder type={2} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    },
    {
      key: '3',
      label: `Đang giao`,
      children: <ListOrder type={3} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    },
    {
      key: '4',
      label: `Hoàn thành`,
      children: <ListOrder type={4} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    },
    {
      key: '5',
      label: `Đã huỷ`,
      children: <ListOrder type={5} fromDate={fromDate} toDate={toDate} keyword={debouncedValue}/>,
    }
  ];


  return (
    <div>
        <div className='my-4 flex items-center gap-2'>
          <RangePicker locale={locale} allowClear  disabledDate={disabledDate} onChange={handleOnChange}  format="DD/MM/YYYY" className='h-10'/>
          <SearchOnChange onClear={handleClear} value={keyword} onSearch={handleSearch} className='h-10 w-[520px]' inputClassName='!h-10' placeholder="Tìm kiếm theo tên người nhận hoặc số điện thoại người nhận"/>
        </div>
       <Tabs
        tabBarStyle={{background:'white', borderTopRightRadius:'5px', borderTopLeftRadius:'5px', marginBottom:'0px'}}
        centered
        defaultActiveKey="0"
        size={'large'}
        style={{ marginBottom: 32 }}
        items={items}
      />
    </div>
  )
}

Order.authenticate = {
  permissions: ["USER"],
};

Order.Layout = GetLayoutPageUser
import Card from '@components/common/card';
import Search from '@components/common/search';
import ArrowDownIcons from '@components/icons/arrow-down-icons';
import ArrowUpIcons from '@components/icons/arrow-up-icons';
import MoreIcons from '@components/icons/more-icons';
import AdminLayout from '@components/layouts/admin-layout';
import ErrorMessage from '@components/ui/error-message';
import LinkButton from '@components/ui/link-button';
import Loader from '@components/ui/loaders/loader';
import UserTable from '@components/user/user-table';
import { useUsersQuery } from '@data/user/admin/use-users-admin.query';
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import cn from "classnames";
import SortForm from '@components/common/sort-form';
import { useBrandsQuery } from '@data/brand/admin/use-brands-admin.query';
import BrandTable from '@components/brand/brand-table';
import OrderTable from '@components/order/order-table';
import { useOrdersQuery } from '@data/order/admin/use-orders-admin.query';
import OrderStatusFilter from '@components/order/order-status-filter';
import SearchOnChange from '@components/common/search-onchange';
import { useDebounce } from 'ahooks';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDatePicker } from '@utils/format-date-picker';
import removeVietnameseDiacritics from '@utils/format-text';
import locale from '@utils/locale-datepicker';
import ShipperLayout from '@components/layouts/shipper-layout';
import { useOrdersShipperQuery } from '@data/order/admin/use-orders-shipper.query';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

export default function ShipperOrderPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("date");
    const [status, setStatus] = useState(null);
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [valueSearchValid, setValueSearchValid] = useState('');
    const debouncedValue = useDebounce(valueSearchValid.trim().toLowerCase(), { wait: 300 });

    const {
        data,
        isLoading: loading,
        error,
    } = useOrdersShipperQuery({
        pageSize: 10,
        sortField: sortField,
        sortDirection: sortDirection,
        pageNo: page,
        keyword: debouncedValue,
        statusIds: status,
        fromDate: fromDate,
        toDate: toDate
    });

    const handleOnChange = (date, dateString) => {
        const filteredDates = dateString.filter(date => date !== null || date !== '');
        if (filteredDates.length >= 2) {
            setFromDate(dateString[0])
            setToDate(dateString[1])
        }
    }
    if (loading)
        return <Loader text={"Loading"} />;
    if (error) return <ErrorMessage message={error?.response?.data?.msg} />;

    const handleTableChange = (pagination, filters, sorter) => {
        setStatus(filters.status)
        if(sorter) {

            if(sorter.order === "ascend") {
                setSortDirection("asc")
                setSortField(sorter.columnKey)
            }
            else if(sorter.order === "descend") {
                setSortDirection("desc")
                setSortField(sorter.columnKey)
            }
            else {
                setSortField("date")
                setSortDirection("desc")
            }
        }

        setPage(pagination.current)
    };

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };
    
    function handleSearch(e) {
        const { value } = e.target;

        const stringForRegex = removeVietnameseDiacritics(value.trim().toLowerCase());
        const regex = /^[a-z0-9\s]+$/g;

        if (regex.test(stringForRegex) || stringForRegex === '') {
            setValueSearchValid(value);
        }
        setSearchTerm(value)
      
    }

    const handleClear = () => {
        setSearchTerm("")
        setValueSearchValid("");
    }

    return (
        <>
            <Card className="flex flex-col mb-8">
                <div className="w-full flex-col items-center">
                    <div className="md:w-1/10 mb-4 md:mb-0 mr-12">
                        <h1 className="text-xl font-semibold text-heading">
                        Đơn hàng vận chuyển bởi bạn
                        </h1>
                    </div>
                    <div className='my-4 flex items-center gap-2'>
                        <SearchOnChange onClear={handleClear} value={searchTerm} onSearch={handleSearch} className='h-10 w-[520px] max-w-[520px]' inputClassName='!h-10' placeholder="Tìm kiếm theo tên người nhận hoặc số điện thoại người nhận"/>
                        <RangePicker locale={locale} allowClear  disabledDate={disabledDate} onChange={handleOnChange}  format="DD/MM/YYYY" className='h-10'/>
                    </div>
                </div>
            </Card>
            <OrderTable
                handleTableChange={handleTableChange} 
                loading={loading} 
                sortField={sortField} 
                sortDirection={sortDirection} 
                orders={data?.orders} 
                totalPage={data?.totalPage} 
                pageSize={10}  
                pageNo={data?.pageNo} 
                keyword={searchTerm}
            />
        </>
    )
}
ShipperOrderPage.authenticate = {
    permissions: [ "SHIPPER"],
  };

ShipperOrderPage.Layout = ShipperLayout;
 
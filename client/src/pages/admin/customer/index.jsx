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
import React, { Fragment, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import cn from "classnames";
import SortForm from '@components/common/sort-form';
import { useCustomersQuery } from '@data/user/admin/use-customers-admin.query';
import SearchOnChange from '@components/common/search-onchange';
import { useDebounce } from 'ahooks';
import removeVietnameseDiacritics from '@utils/format-text';

export default function AdminCustomerPage() {
    

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("registrationDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [valueSearchValid, setValueSearchValid] = useState('');
    const debouncedValue = useDebounce(valueSearchValid.trim().toLowerCase(), { wait: 300 });
    const [status, setStatus] = useState(null)
    const {
        data,
        isLoading: loading,
        error,
      } = useCustomersQuery(
        {
          pageSize: 10,
          sortField: sortField,
          sortDirection: sortDirection,
          pageNo: page,
          keyword: debouncedValue,
          status: status
        }
    );

    function handleSearch(e) {
        const { value } = e.target;

        const stringForRegex = removeVietnameseDiacritics(value.trim().toLowerCase());
        const regex = /^[a-z0-9\s]+$/g;

        if (regex.test(stringForRegex) || stringForRegex === '') {
            setValueSearchValid(value);
        }
        setSearchTerm(value)
      
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setStatus(filters.isActive)
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
                setSortField("registrationDate")
                setSortDirection("desc")
            }
        }

        setPage(pagination.current)
    };

    const handleClear = () => {
        setSearchTerm("")
        setValueSearchValid("");
    }

    if (loading)
        return <Loader text={"Loading"} />;
    if (error) return <ErrorMessage message={error?.response?.data?.msg} />;
    return (
        <Fragment>
            <Card className="flex flex-col mb-8">
                <div className="w-full flex-col items-center">
                    <div className="md:w-1/10 mb-4 md:mb-0 mr-12">
                        <h1 className="text-xl font-semibold text-heading">
                        Khách hàng
                        </h1>
                    </div>
                    <div className='my-4 flex items-center gap-2'>
                        <SearchOnChange onClear={handleClear} value={searchTerm} onSearch={handleSearch} className='h-10 w-[520px] max-w-[520px]' inputClassName='!h-10' placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"/>
                    </div>
                </div>
            </Card>
            <UserTable 
                handleTableChange={handleTableChange} 
                loading={loading} 
                sortField={sortField} 
                sortDirection={sortDirection} 
                users={data?.users} 
                totalPage={data?.totalPage} 
                pageSize={10}  
                pageNo={data?.pageNo} 
                keyword={debouncedValue}
            />
        </Fragment>
    )
}

AdminCustomerPage.authenticate = {
    permissions: ["ADMIN"],
};

AdminCustomerPage.Layout = AdminLayout;
 
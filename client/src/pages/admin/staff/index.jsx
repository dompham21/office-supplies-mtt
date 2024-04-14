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
import React, { Fragment, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import cn from "classnames";
import SortForm from '@components/common/sort-form';
import SearchOnChange from '@components/common/search-onchange';
import { useCustomersQuery } from '@data/user/admin/use-customers-admin.query';
import { useDebounce } from 'ahooks';
import StaffTable from '@components/user/staff-table';
import { useStaffsQuery } from '@data/staff/use-staffs-admin.query';
import { Button } from 'antd';

import {PlusOutlined} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import removeVietnameseDiacritics from '@utils/format-text';

 
const AdminStaffPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("registrationDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [valueSearchValid, setValueSearchValid] = useState('');
    const debouncedValue = useDebounce(valueSearchValid.trim().toLowerCase(), { wait: 300 });
    const [status, setStatus] = useState(null)
    const [role, setRole] = useState(null)
    const router = useRouter();

    const {
        data,
        isLoading: loading,
        error,
      } = useStaffsQuery(
        {
          pageSize: 10,
          sortField: sortField,
          sortDirection: sortDirection,
          pageNo: page,
          keyword: debouncedValue,
          status: status,
          role: role
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
        setRole(filters.role)
       

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
                       Nhân viên
                        </h1>
                    </div>
                    <div className='my-4 flex items-center justify-between gap-2'>
                        <SearchOnChange onClear={handleClear} value={searchTerm} onSearch={handleSearch} className='h-10 w-[520px] max-w-[520px]' inputClassName='!h-10' placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"/>
                        <Button type={'primary'} className=' flex items-center h-10' icon={<PlusOutlined />}>
                            <Link
                                href={`${router.asPath}/create`}
                                title={"Create"}
                            >
                            Thêm mới
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
            <StaffTable 
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

AdminStaffPage.authenticate = {
    permissions: ["ADMIN"],
};

AdminStaffPage.Layout = AdminLayout;
 export default AdminStaffPage
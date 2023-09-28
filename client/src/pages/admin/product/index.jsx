import Card from '@components/common/card';
import Search from '@components/common/search';
import ArrowDownIcons from '@components/icons/arrow-down-icons';
import ArrowUpIcons from '@components/icons/arrow-up-icons';
import MoreIcons from '@components/icons/more-icons';
import AdminLayout from '@components/layouts/admin-layout';
import ProductTable from '@components/product/product-table';
import ErrorMessage from '@components/ui/error-message';
import LinkButton from '@components/ui/link-button';
import Loader from '@components/ui/loaders/loader';
import { useProductsQuery } from '@data/product/admin/use-products-admin.query';
import React, { Fragment, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import cn from "classnames";
import SortForm from '@components/common/sort-form';

export default function AdminProductPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("registrationDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [visible, setVisible] = useState(true);

    const {
        data,
        isLoading: loading,
        error,
      } = useProductsQuery(
        {
          pageSize: 10,
          sortField: sortField,
          sortDirection: sortDirection,
          pageNo: page,
          keyword: searchTerm
        }
    );
    function handleSearch({ searchText }) {
        setSearchTerm(searchText);
    }

    function handlePagination(current) {
        setPage(current);
    }

    const toggleVisible = () => {
        setVisible((v) => !v);
    };

    if (loading)
        return <Loader text={"common:text-loading"} />;
    if (error) return <ErrorMessage message={error.msg} />;

    return (
        <Fragment>
            <Card className="flex flex-col mb-8">
                <div className="w-full flex flex-col md:flex-row items-center">
                    <div className="md:w-1/10 mb-4 md:mb-0 mr-12">
                        <h1 className="text-xl font-semibold text-heading">
                        Products
                        </h1>
                    </div>
                    <div className="w-full md:w-9/10 flex flex-col md:flex-row items-center">
                        <div className="w-full flex items-center">
                            <Search onSearch={handleSearch} />
                            <button
                                className="text-accent text-base font-semibold flex items-center md:ms-5 mt-5 md:mt-0"
                                onClick={toggleVisible}
                            >
                                {"Filter"}{" "}
                                {visible ? (
                                <ArrowUpIcons className="ms-2" />
                                ) : (
                                <ArrowDownIcons className="ms-2" />
                                )}
                            </button>
                            <LinkButton
                                href={`/admin/product/create`}
                                className="h-10 ms-4 md:ms-6"
                            >
                                <AiOutlinePlus className='font-bold text-xl mr-1'/>
                                <span>
                                 {"Add Product"}
                                </span>
                            </LinkButton>
                        </div>
                    </div>
                    <button
                        className="hidden md:flex w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 items-center justify-center flex-shrink-0 ms-5 transition duration-300"
                    >
                        <MoreIcons className="w-3.5 text-body" />
                    </button>
                </div>
                <div
                    className={cn("w-full flex transition", {
                        "h-auto visible": visible,
                        "h-0 invisible": !visible,
                    })}
                    >
                    <div className="flex flex-col md:flex-row md:items-center mt-5 md:mt-8 border-t border-gray-200 pt-5 md:pt-8 w-full">
                        <SortForm
                            className="w-full  mt-5 md:mt-0"
                            onSortFieldChange={({ value }) => {
                                setSortField(value);
                            }}
                            onSortDirectionChange={({ value }) => {
                                setSortDirection(value);
                            }}
                            onClear={() => {
                                setSortField("registrationDate");
                                setSortDirection("desc");
                            }}
                            options={[
                                { value: "name", label: "Name" },
                                { value: "price", label: "Price" },
                                { value: "soldQuantity", label: "Sold Quantity" },
                                { value: "inStock", label: "Quantity" },
                                { value: "isActive", label: "Status" },
                                { value: "registrationDate", label: "Updated At" },
                            ]}
                        />
                    </div>
                </div>
            </Card>
            <ProductTable sortField={sortField} sortDirection={sortDirection} products={data?.products} onPagination={handlePagination} totalPage={data?.totalPage} pageSize={10}  pageNo={data?.pageNo} keyword={searchTerm}/>
        </Fragment>
    )
}

AdminProductPage.authenticate = {
    permissions: ["ADMIN"],
  };

AdminProductPage.Layout = AdminLayout;
 
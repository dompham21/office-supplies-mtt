import Image from 'next/image';
import React, { Fragment, useState } from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import Badge from '@components/ui/badge';
import { currencyMoney } from '@utils/format-currency';
import Pagination from '@components/ui/pagination';
import ActionButtons from '@components/common/action-button';
import { useRouter } from 'next/router';
import { Modal, Table, notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query';
import { formatDate } from '@utils/format-date';
import { formatAddress } from '@utils/format-address';
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from './invoice-order';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';

function OrderTable({ orders, totalPage, pageSize, pageNo, keyword, loading, handleTableChange }) {
    const router = useRouter();
    const queryClient = useQueryClient();   

    const { confirm } = Modal;

    let columns = [
        {
            title: "ID",
            key: "id",
            align: "center",
            width: 70,
            sorter: true,
            ellipsis: true,
            render: (user) => {
              return <span className="whitespace-nowrap">{user?.id}</span>;
          },
        },
        {
            title: "Name",
            key: "name",
            align: "left",
            width: 100,
            sorter: true,
            render: (user) => {
                return <span className="whitespace-nowrap">{user?.name}</span>;
            },
        },
        {
            title: "Phone",
            key: "phone",
            align: "left",
            width: 120,
            render: (user) => {
                return <span className="whitespace-nowrap">{user?.phone}</span>;
            },
        },
        {
            title: "Total",
            dataIndex: "totalPrice",
            key: "totalPrice",
            align: "center",
            width: 120,
            sorter: true,
            render: (totalPrice) => {
                return <span className="whitespace-nowrap">{currencyMoney(totalPrice)}</span>;
            },
        },
        {
            title: "Shipping Address",
            dataIndex: "address",
            key: "address",
            align: "left",
            width: 270,
            render: (address) => (
              <div>{address}</div>
            ),
        },
        {
            title: "Order Date",
            dataIndex: "date",
            key: "date",
            align: "left",
            width: 120,
            sorter: true,
            render: (date) => {
              return (
                <span className="whitespace-nowrap">
                    {formatDateDDMMYYYY(date)}
                </span>
              );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "left",
            width: 120,
            filters: [
              {
                text: 'Chờ thanh toán',
                value: '1',
              },
              {
                text: 'Chờ duyệt',
                value: '2',
              },
              {
                text: 'Đang giao',
                value: '3',
              },
              {
                text: 'Hoàn thành',
                value: '4',
              },
              {
                text: 'Đã huỷ',
                value: '5',
              },
            ],
            render: (status) => (
              <span
                className="whitespace-nowrap font-semibold"
              >
                {status?.name}
              </span>
            ),
          },
          {
              title: "Actions",
              dataIndex: "id",
              key: "actions",
              align: "center",
              width: 80,
              render: (id, record) => (
                <ActionButtons
                  id={record?.id}
                  deleteButton={ false}
                  approveButton={false}
                  viewButton={true}
                  detailsUrl={`${router.asPath}/${id}`}
                />
              ),
          },
      ];

 
    return (
    <Fragment>
      <div className="rounded overflow-hidden shadow mb-6">
          <Table
            rowKey={(record) => record?.id}
            columns={columns}
            dataSource={orders}
            onChange={handleTableChange}
            pagination={
              {
                current: pageNo,
                pageSize: pageSize,
                total: pageSize * totalPage
              }
            }
            loading={loading}
            scroll={{ x: 900 }}
          />

      </div>
    </Fragment>
  )
}

export default OrderTable
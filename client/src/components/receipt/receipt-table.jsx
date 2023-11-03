import Image from 'next/image';
import React, { Fragment, useState } from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import Badge from '@components/ui/badge';
import { currencyMoney } from '@utils/format-currency';
import Pagination from '@components/ui/pagination';
import ActionButtons from '@components/common/action-button';
import { useRouter } from 'next/router';
import { Modal, notification, Table } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query';
import { useDeletePosterMutation } from '@data/poster/admin/use-delete-poster.mutation';
import { useApprovePosterMutation } from '@data/poster/admin/use-approve-poster.mutation';
import { toast } from 'react-toastify';
import { formatIsoStringDate } from '@utils/format-date-iso';
import { useDeletePromotionMutation } from '@data/promotion/use-delete-promotion.mutation';
import { useApprovePromotionMutation } from '@data/promotion/use-approve-promotion.mutation';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import ViewPurchaseDetail from './view-receipt-detail';
import ViewReceiptDetail from './view-receipt-detail';

function ReceiptTable({ receipts, totalPage, pageSize, pageNo, sortField, sortDirection, keyword, loading, handleTableChange}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null);
    const { confirm } = Modal;
  
    const calculatorTotal = (listReceiptDetails) => {
      let total = 0;
      listReceiptDetails?.map(item => {
        total += (item?.unitPrice * item?.quantity)
      })
      return total;
    }

    let columns = [
      {
        title: "Mã phiếu nhập",
        dataIndex: "id",
        align: "center",
        width: 140,
        sorter: true,
        key: "id"
      },
      {
        title: "Mã phiếu đặt",
        dataIndex: "purchaseOrder",
        align: "center",
        width: 140,
        sorter: true,
        key: "purchaseOrder",
        render: (purchaseOrder, record) => {
            return (
              <span className="whitespace-nowrap ">
                {purchaseOrder?.id}
              </span>
            );
          }
      },
      {
          title: "Nhân viên nhập",
          dataIndex: "staff",
          key: "staff",
          align: "left",
          width: 150,
          ellipsis: true,
          render: (staff, record) => {
            return (
              <span className="whitespace-nowrap ">
                {staff?.name}
              </span>
            );
          }
      },
      {
          title: "Nhà cung cấp",
          dataIndex: "purchaseOrder",
          key: "supplier",
          align: "left",
          width: 120,
          ellipsis: true,
          render: (purchaseOrder, record) => {
            return (
              <span className="whitespace-nowrap ">
                {purchaseOrder?.supplier?.name}
              </span>
            );
          }
      },
      {
        title: "Tổng giá trị",
        dataIndex: "purchaseOrder",
        key: "price",
        align: "left",
        width: 170,
        ellipsis: true,
        render: (purchaseOrder, record) => {
          return (
            <span className="whitespace-nowrap ">
            {currencyMoney(calculatorTotal(purchaseOrder?.purchaseOrderDetails))}
            </span>
          );
        }
      },
      {
        title: "Thời gian tạo",
        dataIndex: "date",
        key: "date",
        align: "center",
        width: 150,
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
        title: "Actions",
        dataIndex: "id",
        key: "actions",
        align: "center",
        width: 80,
        render: (id, record) => (
          <ActionButtons
            id={record?.id}
            editUrl={null}
            viewModal={true}
            handleOpenModal={handleOpenModal}
          />
        ),
      },
    ];
    const handleOpenModal = (id) => {
      setIsModalOpen(true)
      setCurrentId(id)
    }
  return (
    <Fragment>
      {
      currentId && isModalOpen && 
        <ViewReceiptDetail id={currentId} open={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      }
      <div className="rounded overflow-hidden shadow mb-6">  
        <Table
          rowKey={(record) => record?.id}
          columns={columns}
          dataSource={receipts}
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

export default ReceiptTable
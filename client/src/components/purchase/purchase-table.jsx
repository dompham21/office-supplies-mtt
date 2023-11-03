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
import ViewPurchaseDetail from './view-purchase-detail';

function PurchaseTable({ purchaseOrders, totalPage, pageSize, pageNo, sortField, sortDirection, keyword, loading, handleTableChange}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null);
    const { confirm } = Modal;
  
    const calculatorTotal = (listPurchaseOrderDetails) => {
      let total = 0;
      listPurchaseOrderDetails?.map(item => {
        total += (item?.unitPrice * item?.quantity)
      })
      return total;
    }

    let columns = [
      {
        title: "Mã phiếu đặt",
        dataIndex: "id",
        align: "center",
        width: 120,
        sorter: true,
        key: "id"
      },
      {
          title: "Nhân viên đặt",
          dataIndex: "staff",
          key: "staff",
          align: "left",
          width: 200,
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
          dataIndex: "supplier",
          key: "supplier",
          align: "left",
          width: 120,
          ellipsis: true,
          render: (supplier, record) => {
            return (
              <span className="whitespace-nowrap ">
                {supplier?.name}
              </span>
            );
          }
      },
      {
        title: "Tổng giá trị",
        dataIndex: "price",
        key: "price",
        align: "left",
        width: 170,
        ellipsis: true,
        render: (_, record) => {
          return (
            <span className="whitespace-nowrap ">
            {currencyMoney(calculatorTotal(record?.purchaseOrderDetails))}
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
        <ViewPurchaseDetail id={currentId} open={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      }
      <div className="rounded overflow-hidden shadow mb-6">  
        <Table
          rowKey={(record) => record?.id}
          columns={columns}
          dataSource={purchaseOrders}
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

export default PurchaseTable
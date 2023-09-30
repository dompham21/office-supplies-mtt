import Image from 'next/image';
import React from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { Table } from "@components/ui/table";
import Badge from '@components/ui/badge';
import { currencyMoney } from '@utils/format-currency';
import Pagination from '@components/ui/pagination';
import ActionButtons from '@components/common/action-button';
import { useRouter } from 'next/router';
import { Modal, notification } from 'antd';
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

function PromotionTable({ promotions, onPagination, totalPage, pageSize, pageNo, sortField, sortDirection, keyword }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { confirm } = Modal;

    const { mutate: deletePromotion, isLoading: loadingDelete } = useDeletePromotionMutation();
    const { mutate: approvePromotion, isLoading: loadingApprove } = useApprovePromotionMutation();



    // const handleDeletePromotion = (e, id) => {
    //     e.preventDefault()
    //     confirm({
    //         title: 'Do you want to delete this poster?',
    //         icon: <ExclamationCircleFilled />,
    //         centered: true,
    //         onOk() {
    //           deletePromotion(
    //                 {
    //                   id: id
    //                 },
    //                 {
    //                   onSuccess: ( value ) => {
    //                       const response  = value.data
            
    //                       if (response) {
    //                           const { result, code, status, msg } = response;
    //                           if(result == 1) {
    //                             toast.success('xoá promotion thành công!', {
    //                               position: "top-right",
    //                               autoClose: 5000,
    //                               hideProgressBar: false,
    //                               closeOnClick: true,
    //                               pauseOnHover: true,
    //                               draggable: true,
    //                               progress: undefined,
    //                               theme: "light",
    //                             });     
    //                           }
    //                           else if(result == 0) {
    //                             toast.error(msg, {
    //                               position: "top-right",
    //                               autoClose: 5000,
    //                               hideProgressBar: false,
    //                               closeOnClick: true,
    //                               pauseOnHover: true,
    //                               draggable: true,
    //                               progress: undefined,
    //                               theme: "light",
    //                             });
    //                           }
    //                       } else {
    //                         toast.error('Xoá promotion thất bại!', {
    //                           position: "top-right",
    //                           autoClose: 5000,
    //                           hideProgressBar: false,
    //                           closeOnClick: true,
    //                           pauseOnHover: true,
    //                           draggable: true,
    //                           progress: undefined,
    //                           theme: "light",
    //                         });
    //                       }
    //                   },
    //                   onError: (error) => {
    //                     if(error?.response?.status == 400) {
    //                       if(error?.response?.data?.msg) {
      
    //                         toast.error(error?.response?.data?.msg, {
    //                           position: "top-right",
    //                           autoClose: 5000,
    //                           hideProgressBar: false,
    //                           closeOnClick: true,
    //                           pauseOnHover: true,
    //                           draggable: true,
    //                           progress: undefined,
    //                           theme: "light",
    //                         });
    //                       }
    //                     }
    //                     else {
    //                       toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
    //                         position: "top-right",
    //                         autoClose: 5000,
    //                         hideProgressBar: false,
    //                         closeOnClick: true,
    //                         pauseOnHover: true,
    //                         draggable: true,
    //                         progress: undefined,
    //                         theme: "light",
    //                       });
    //                     }
                          
    //                   },
                      
    //                   // Always refetch after error or success:
    //                   onSettled: () => {
    //                     queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROMOTIONS_ADMIN, {
    //                         "pageSize": 10,
    //                         "sortField": sortField,
    //                         "sortDirection": sortDirection,
    //                         "pageNo": Number(pageNo),
    //                       }]});
    //                   },
                    
    //                 }
    //             )
    //         }
    //     });
    // }

  

    // const handleApprovePromotion = (e, id) => {
    //     e.preventDefault()
    //     confirm({
    //         title: 'Do you want to approve this promotion?',
    //         icon: <ExclamationCircleFilled />,
    //         centered: true,
    //         onOk() {
    //           approvePromotion(
    //                 {
    //                   id: id
    //                 },
    //                 {
    //                   onSuccess: ( value ) => {
    //                       const response  = value.data
            
    //                       if (response) {
    //                           const { result, code, status, msg } = response;
    //                           if(result == 1) {
    //                             toast.success("Huỷ xoá promotion thành công!", {
    //                               position: "top-right",
    //                               autoClose: 5000,
    //                               hideProgressBar: false,
    //                               closeOnClick: true,
    //                               pauseOnHover: true,
    //                               draggable: true,
    //                               progress: undefined,
    //                               theme: "light",
    //                             });     
    //                           }
    //                           else if(result == 0) {
    //                             toast.error(msg, {
    //                               position: "top-right",
    //                               autoClose: 5000,
    //                               hideProgressBar: false,
    //                               closeOnClick: true,
    //                               pauseOnHover: true,
    //                               draggable: true,
    //                               progress: undefined,
    //                               theme: "light",
    //                             });
    //                           }
    //                       } else {
    //                         toast.error('Huỷ xoá promotion thất bại!', {
    //                           position: "top-right",
    //                           autoClose: 5000,
    //                           hideProgressBar: false,
    //                           closeOnClick: true,
    //                           pauseOnHover: true,
    //                           draggable: true,
    //                           progress: undefined,
    //                           theme: "light",
    //                         });
    //                       }
    //                   },
    //                   onError: (error) => {
    //                     if(error?.response?.status == 400) {
    //                       if(error?.response?.data?.msg) {
      
    //                         toast.error(error?.response?.data?.msg, {
    //                           position: "top-right",
    //                           autoClose: 5000,
    //                           hideProgressBar: false,
    //                           closeOnClick: true,
    //                           pauseOnHover: true,
    //                           draggable: true,
    //                           progress: undefined,
    //                           theme: "light",
    //                         });
    //                       }
    //                     }
    //                     else {
    //                       toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
    //                         position: "top-right",
    //                         autoClose: 5000,
    //                         hideProgressBar: false,
    //                         closeOnClick: true,
    //                         pauseOnHover: true,
    //                         draggable: true,
    //                         progress: undefined,
    //                         theme: "light",
    //                       });
    //                     }
                          
    //                   },
                      
    //                   // Always refetch after error or success:
    //                   onSettled: () => {
    //                     queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROMOTIONS_ADMIN, {
    //                         "pageSize": 10,
    //                         "sortField": sortField,
    //                         "sortDirection": sortDirection,
    //                         "pageNo": Number(pageNo),
    //                       }]});
    //                   },
                    
    //                 }
    //             )
    //         }
    //     });
    // }

    let columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: "center",
            width: 100,
            ellipsis: true,
        },
        {
          title: "Staff name",
          dataIndex: "staff",
          key: "staff",
          align: "left",
          width: 200,
          ellipsis: true,
          render: (staff) => (
            <div>
              {
               <span>{staff}</span>
              }
            </div>
          ),
        },
        {
          title: "Reason",
          dataIndex: "reason",
          key: "reason",
          align: "left",
          width: 200,
          ellipsis: true,
          render: (staff) => (
            <div>
              {
               <span>{staff}</span>
              }
            </div>
          ),
        },
        {
          title: "Start Date",
          dataIndex: "startDate",
          key: "startDate",
          align: "left",
          width: 200,
          render:(startDate) => (
            <div>{formatDateDDMMYYYY(startDate)}</div>
          )
        },
        {
          title: "Finish Date",
          dataIndex: "finishDate",
          key: "finishDate",
          align: "left",
          width: 200,
          render:(finishDate) => (
            <div>{formatDateDDMMYYYY(finishDate)}</div>
          )
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
                editUrl={`${router.asPath}/${id}/edit`}
              />
            ),
        },
      ];
  return (
    <>
        <div className="rounded overflow-hidden shadow mb-6">
            <Table
                columns={columns}
                emptyText={"table:empty-table-data"}
                data={promotions}
                rowKey="id"
                scroll={{ x: 900 }}
            />
        </div>
         {totalPage && totalPage > 0 && pageSize && pageNo ? (
            <div className="flex justify-end items-center">
            <Pagination
                total={totalPage * pageSize}
                current={pageNo}
                pageSize={pageSize}
                onChange={onPagination}
                showLessItems
            />
            </div>
        ) : null}
    </>
  )
}

export default PromotionTable
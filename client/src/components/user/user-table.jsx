import Image from 'next/image';
import React, { Fragment, useState } from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import Badge from '@components/ui/badge';
import { currencyMoney } from '@utils/format-currency';
import Pagination from '@components/ui/pagination';
import ActionButtons from '@components/common/action-button';
import { useRouter } from 'next/router';
import { Button, Modal, Table, notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query';
import { useDeleteUserMutation } from '@data/user/admin/use-delete-user.mutation';
import { useApproveUserMutation } from '@data/user/admin/use-approve-user.mutation';
import { toast } from 'react-toastify';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import { useDeleteCustomerMutation } from '@data/user/admin/use-delete-customer.mutation';
import { useApproveCustomerMutation } from '@data/user/admin/use-approve-customer.mutation';
import ViewCustomerDetail from './view-customer-detail';

function UserTable({ users, totalPage, pageSize, pageNo, sortField, sortDirection, keyword, loading, handleTableChange }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null);
    const { confirm } = Modal;

    const { mutate: deleteUser, isLoading: loadingDelete } = useDeleteCustomerMutation();
    const { mutate: approveUser, isLoading: loadingApprove } = useApproveCustomerMutation();


    const handleDeleteUser = (e, id) => {
        e.preventDefault()
        confirm({
            title: `Bạn có chắc chắn muốn vô hiệu hoá tài khoản với mã khách hàng ${id} không?`,
            icon: <ExclamationCircleFilled />,
            okText: "Vô hiệu hoá",
            cancelText: "Huỷ bỏ",
            onOk() {
              deleteUser(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Vô hiệu hoá tài khoản khách hàng thành công!', {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });      
                              }
                              else if(result == 0) {
                                toast.error(msg, {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              }
                          } else {
                            toast.error('Vô hiệu hoá tài khoản khách hàng thất bại!', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          }
                      },
                      onError: (error) => {
                        console.log(error)
                        if(error?.response?.status == 400) {
                          if(error?.response?.data?.msg) {
      
                            toast.error(error?.response?.data?.msg, {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          }
                        }
                        else {
                          toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                        }
                          
                      },
                      
                      // Always refetch after error or success:
                      onSettled: () => {
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CUSTOMERS_ADMIN, {
                            "pageSize": 10,
                            "sortField": sortField,
                            "sortDirection": sortDirection,
                            "pageNo": Number(pageNo),
                            "keyword": keyword
                          }]});
                      },
                    
                    }
                )
            }
        });
    }

    const handleApproveUser = (e, id) => {
        e.preventDefault()
        confirm({
            title: `Bạn có chắc chắn muốn kích hoạt tài khoản với mã khách hàng ${id} không?`,
            icon: <ExclamationCircleFilled />,
            okText: "Kích hoạt",
            cancelText: "Huỷ bỏ",
            onOk() {
              approveUser(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Kích hoạt tài khoản khách hàng thành công!', {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });      
                              }
                              else if(result == 0) {
                                toast.error(msg, {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              }
                          } else {
                            toast.error('Kích hoạt tài khoản khách hàng thất bại!', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          }
                      },
                      onError: (error) => {
                        if(error?.response?.status == 400) {
                          if(error?.response?.data?.msg) {
      
                            toast.error(error?.response?.data?.msg, {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          }
                        }
                        else {
                          toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                        }
                      },
                      
                      // Always refetch after error or success:
                      onSettled: () => {
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CUSTOMERS_ADMIN, {
                            "pageSize": 10,
                            "sortField": sortField,
                            "sortDirection": sortDirection,
                            "pageNo": Number(pageNo),
                            "keyword": keyword
                          }]});
                      },
                    
                    }
                )
            }
        });
    }

    let columns = [
      {
        title: "Mã KH",
        dataIndex: "id",
        align: "center",
        width: 100,
        sorter: true
      },
      {
          title: "Tên khách hàng",
          dataIndex: "name",
          key: "name",
          align: "left",
          width: 170,
          sorter: true,
          ellipsis: true,
      },
      {
          title: "Email",
          dataIndex: "email",
          key: "email",
          align: "left",
          width: 200,
          ellipsis: true,
      },
      {
          title: "Số điện thoại",
          dataIndex: "phone",
          key: "phone",
          align: "left",
          width: 120,
          ellipsis: true,
      },
      {
        title: "Thời gian tạo",
        dataIndex: "registrationDate",
        key: "registrationDate",
        align: "center",
        width: 150,
        sorter: true,
        render: (registrationDate) => {
          return (
            <span className="whitespace-nowrap">
              {formatDateDDMMYYYY(registrationDate)}
            </span>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        align: "center",
        width: 150,
        filters: [
          {
            text: 'Đang hoạt động',
            value: true,
          },
          {
            text: 'Vô hiệu hoá',
            value: false,
          },
        ],
        render: (isActive) => (
          <Badge
            text={isActive ? "Đang hoạt động" : "Vô hiệu hoá"}
            color={
                isActive
                ? "bg-[#009f7f]"
                : "bg-accent"
            }
          />
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
            editUrl={null}
            deleteButton={record.isActive ? true : false}
            approveButton={record.isActive ? false : true}
            handleDelete={handleDeleteUser}
            handleApprove={handleApproveUser}
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
        <ViewCustomerDetail id={currentId} open={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      }
      <div className="rounded overflow-hidden shadow mb-6">  
        <Table
          rowKey={(record) => record?.id}
          columns={columns}
          dataSource={users}
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

export default UserTable
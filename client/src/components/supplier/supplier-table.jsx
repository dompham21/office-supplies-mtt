import Image from 'next/image';
import React from 'react'
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
import { toast } from 'react-toastify';
import { useDeleteSupplierMutation } from '@data/supplier/admin/use-delete-supplier.mutation';
import { useApproveSupplierMutation } from '@data/supplier/admin/use-approve-supplier.mutation';

function SupplierTable({ suppliers, onPagination, totalPage, pageSize, pageNo, sortField, sortDirection, keyword, loading, handleTableChange }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { confirm } = Modal;

    const { mutate: deleteSupplier, isLoading: loadingDelete } = useDeleteSupplierMutation();
    const { mutate: approveSupplier, isLoading: loadingApprove } = useApproveSupplierMutation();



    const handleDeleteSupplier = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Bạn có muốn vô hiệu hoá nhà cung cấp này không',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
              deleteSupplier(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Vô hiệu hoá nhà cung cấp thành công!', {
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
                            toast.error('Vô hiệu hoá nhà cung cấp thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUPPLIERS_ADMIN, {
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

  

    const handleApproveSupplier = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Bạn có muốn tái kích hoạt nhà cung cấp này không?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
              approveSupplier(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Tái kích hoạt nhà cung cấp thành công!', {
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
                            toast.error('Tái kích hoạt nhà cung cấp thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUPPLIERS_ADMIN, {
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
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: "center",
            width: 100,
            ellipsis: true,
            sorter: (a, b) => a - b
        },
        {
            title: "Tên nhà cung cấp",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: 150,
            ellipsis: true,
            sorter: (a, b) => a - b,
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          align: "left",
          width: 150,
        },
        {
          title: "Số điện thoại",
          dataIndex: "phone",
          key: "phone",
          align: "left",
          width: 150,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            align: "left",
            width: 200,
            ellipsis: true,
        },
        {
          title: "Website",
          dataIndex: "website",
          key: "website",
          align: "left",
          width: 200,
          ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            width: 110,
            render: (isActive) => (
              <Badge
                text={isActive ? "Publish" : "Banned"}
                color={
                    isActive
                    ? "bg-[#009f7f]"
                    : "bg-accent"
                }
              />
            ),
            sorter: (a, b) => a - b
        },
        {
            title: "Actions",
            dataIndex: "id",
            key: "actions",
            align: "center",
            width: 100,
            render: (id, record) => (
              <ActionButtons
                id={record?.id}
                editUrl={`${router.asPath}/${id}/edit`}
                deleteButton={record.isActive ? true : false}
                approveButton={record.isActive ? false : true}
                handleDelete={handleDeleteSupplier}
                handleApprove={handleApproveSupplier}
              />
            ),
        },
      ];
  return (
    <>
        <div className="rounded overflow-hidden shadow mb-6">
          <Table
            rowKey={(record) => record?.id}
            columns={columns}
            dataSource={suppliers}
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
    </>
  )
}

export default SupplierTable
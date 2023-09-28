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
import { useDeleteUserMutation } from '@data/user/admin/use-delete-user.mutation';
import { useApproveUserMutation } from '@data/user/admin/use-approve-user.mutation';
import { useDeleteBrandMutation } from '@data/brand/admin/use-delete-brand.mutation';
import { useApproveBrandMutation } from '@data/brand/admin/use-approve-brand.mutation';
import { toast } from 'react-toastify';

function BrandTable({ brands, onPagination, totalPage, pageSize, pageNo, sortField, sortDirection, keyword }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { confirm } = Modal;

    const { mutate: deleteBrand, isLoading: loadingDelete } = useDeleteBrandMutation();
    const { mutate: approveBrand, isLoading: loadingApprove } = useApproveBrandMutation();



    const handleDeleteBrand = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Do you want to delete this brand?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
                deleteBrand(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Xoá thương hiệu thành công!', {
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
                            toast.error('Xoá thương hiệu thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.BRANDS_ADMIN, {
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

  

    const handleApproveBrand = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Do you want to approve this brand?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
              approveBrand(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Huỷ xoá thương hiệu thành công!', {
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
                            toast.error('Huỷ xoá thương hiệu thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.BRANDS_ADMIN, {
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
        },
        {
          title: "Image",
          dataIndex: "image",
          key: "image",
          align: "left",
          width: 74,
          render: (image) => (
            <Image
              src={image || productPlaceholder}
              alt={"name"}
              width={42}
              height={42}
              className="rounded overflow-hidden w-[42px] h-[42px] object-cover"
            />
          ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align: "left",
            width: 300,
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            width: 100,
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
                deleteButton={record.isActive ? true : false}
                approveButton={record.isActive ? false : true}
                handleDelete={handleDeleteBrand}
                handleApprove={handleApproveBrand}
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
                data={brands}
                rowKey="id"
                scroll={{ x: 900 }}
            />
        </div>
         {totalPage && totalPage > 0 && pageSize && pageNo  && (
            <div className="flex justify-end items-center">
            <Pagination
                total={totalPage * pageSize}
                current={pageNo}
                pageSize={pageSize}
                onChange={onPagination}
                showLessItems
            />
            </div>
        )}
    </>
  )
}

export default BrandTable
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
import { useDeleteProductMutation } from '@data/product/admin/use-delete-product.mutation';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query';
import { useApproveProductMutation } from '@data/product/admin/use-approve-product.mutation';
import { toast } from 'react-toastify';

function ProductTable({ products, onPagination, totalPage, pageSize, pageNo, sortField, sortDirection, keyword }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { confirm } = Modal;

    const { mutate: deleteProduct, isLoading: loadingDelete } = useDeleteProductMutation();
    const { mutate: approveProduct, isLoading: loadingApprove } = useApproveProductMutation();

    const handleDeleteProduct = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Bạn có chắc chắn muốn vô hiệu hoá sản phẩm này không?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
                deleteProduct(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success("Vô hiệu hoá sản phẩm thành công!", {
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
                            toast.error('Vô hiệu hoá sản phẩm thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS_ADMIN, {
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

    const handleApproveProduct = (e, id) => {
        e.preventDefault()
        confirm({
            title: 'Bạn có chắc chắn muốn kích hoạt sản phẩm này không?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
                approveProduct(
                    {
                      id: id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Kích hoạt sản phẩm thành công!', {
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
                            toast.error('Kích hoạt sản phẩm thất bại!', {
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
                        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS_ADMIN, {
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
          title: "Image",
          dataIndex: "images",
          key: "images",
          align: "left",
          width: 74,
          render: (images) => (
            <Image
              src={(images && images.length > 0 && images[0]) || productPlaceholder}
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
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
            width: 120,
            align: "center",
            ellipsis: true,
            render: (brand) => (
              <span className="whitespace-nowrap truncate">{brand?.name}</span>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 120,
            align: "center",
            ellipsis: true,
            render: (category) => (
                <span className="whitespace-nowrap truncate">{category?.name}</span>
            ),
        },
        {
            title: "Price/Unit",
            dataIndex: "price",
            key: "price",
            align: "right",
            width: 100,
            render: (price) => (
                <span className="whitespace-nowrap" title={price}>
                    {currencyMoney(price)}
                </span>
            )
        },
        {
            title: "Quantity",
            dataIndex: "inStock",
            key: "inStock",
            align: "center",
            width: 100,
        },
        {
            title: "Sold quantity",
            dataIndex: "soldQuantity",
            key: "soldQuantity",
            align: "center",
            width: 100,
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
                handleDelete={handleDeleteProduct}
                handleApprove={handleApproveProduct}
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
                data={products}
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

export default ProductTable
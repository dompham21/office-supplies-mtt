import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AdminLayout from "@components/layouts/admin-layout";
import Loader from "@components/ui/loaders/loader";
import ErrorMessage from "@components/ui/error-message";
import { useOrderDetailQuery } from "@data/order/admin/use-order-detail.query";
import Card from "@components/common/card";
import { Table } from "@components/ui/table";
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { currencyMoney } from "@utils/format-currency";
import { formatAddress } from "@utils/format-address";
import { Steps, Button, Modal } from 'antd';
import { LoadingOutlined, SmileOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleFilled, ArrowLeftOutlined, StopOutlined, PrinterOutlined, DeliveredProcedureOutlined  } from '@ant-design/icons';
import ValidationError from "@components/ui/form-validation-error";
import { useCancelOrderMutation, useChangeOrderStatusMutation } from "@data/order/admin/use-cancel-order.mutation";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useQueryClient } from "react-query";
import OrderStatusSelectInput from "@components/order/order-status-select";
import { toast } from "react-toastify";
import SelectInput from "@components/ui/select-input";
import { Fragment, useState } from "react";
import { useShippersQuery } from "@data/shipper/use-shippers-admin.query";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetShipperMutation } from "@data/shipper/use-set-shipper-admin.mutation";
import ShipperLayout from "@components/layouts/shipper-layout";
import { useOrderDetailShipperQuery } from "@data/order/admin/use-order-detail-shipper.query";
import { useCancelOrderShipperMutation } from "@data/order/admin/use-cancel-shipper-order.mutation";
import { useDoneOrderShipperMutation } from "@data/order/admin/use-done-shipper-order.mutation";
import ModalInvoice from "@components/invoice";
import { useInvoiceDetailAdminQuery } from "@data/invoice/admin/use-invoice-detail-admin.query";
const { confirm } = Modal;
const deliveringFormSchema = yup.object().shape({
  staffDelivery: yup
      .object()
      .required("Vui lòng chọn nhân viên giao hàng!"), 
});
export default function OrderDetailsShipperPage() {
  const { query } = useRouter();
  const { mutate: doneOrder, isLoading: loadingDone } = useDoneOrderShipperMutation();
  const { mutate: cancelOrder, isLoading: canceling } = useCancelOrderShipperMutation();
  const [isModalInvoiceOpen, setIsModalInvoiceOpen] = useState(false)
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ keyword, setKeyword] = useState("");
  const {
    data: dataInvoice,
  } = useInvoiceDetailAdminQuery(query.id);

  const {
    data,
    isLoading: loading,
    error,
  } = useOrderDetailShipperQuery(query.id);


  const {
    handleSubmit: handleSubmitCancel,
  } = useForm();

  const {
    handleSubmit: handleSubmitDone,
  } = useForm();


  const calTotal = () => {
    if(data?.order) {
        return data?.order?.totalPrice;
    }
  }
  
  if (loading) return <Loader text={"Đang tải"} />;
  if (error) return <ErrorMessage message={error.message} />;

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "product",
      key: "image",
      width: 70,
      render: (product) => (
        <Image
          src={product?.images && product?.images.length > 0 && product?.images[0] ||  productPlaceholder}
          alt="alt text"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "name",
      align: "left",
      render: (product, item) => (
        <div>
          <span className="font-semibold text-heading">{product?.name}</span>
          <span className="mx-2 ">x</span>
          <span className="font-semibold text-heading">
            {item?.quantity}
          </span>
        </div>
      ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "product",
      key: "name",
      align: "center",
      render: (product, item) => (
        <div>
          <span className="font-semibold text-heading">
            {currencyMoney(item?.unitPrice)}
          </span>
        </div>
      ),
    },
    {
      title: "Sub total",
      dataIndex: "product",
      key: "totalPrice",
      align: "right",
      render: (product, item) => {
        return <span className="text-base">{currencyMoney(product?.price * item?.quantity)}</span>;
      },
    },
  ];

  const renderListStatus = (status) => {
    if(status === 1) { //  chờ thanh toán
        return [
            {
                title: 'Chờ thanh toán',
                icon: <LoadingOutlined />,
            },
            {
                title: 'Chờ duyệt',
            },
            {
                title: 'Đang giao',
            },
            {
                title: 'Hoàn thành',
                icon: <SmileOutlined />,
            },
            {
                title: 'Đã huỷ',
                icon: <CloseCircleOutlined />
            },
           
        ]
    }
    else if(status == 5) {
        return  [
            {
                title: 'Đã huỷ',
                icon: <CloseCircleOutlined />
            }
        ]
    }
    else {
        return [
            {
                title: 'Chờ duyệt',
            },
            {
                title: 'Đang giao',
            },
            {
                title: 'Hoàn thành',
                icon: <SmileOutlined />,
            }
        ]
    }
  }

  const renderCurrentStatus = (status) => {
    if(status == 1 || status == 5) {
        return 0;
    }
    else return status - 2
  }

  const renderStatusProcess = (status) => {
    if(status == 5) {
        return "error";
    }
    else if(status == 4) {
        return "finish"
    }
    else "process"
  }

  const onSubmitCancelOrder = () => {
     
    confirm({
        title: 'Bạn có chắc muốn huỷ đơn hàng này không?',
        icon: <ExclamationCircleFilled />,
        cancelText: 'Huỷ Bỏ',
        okText: 'Đồng ý',
        onOk() {
            cancelOrder(
                {
                  id: query?.id
                },
                {
                  onSuccess: ( value ) => {
                      const response  = value.data
                        
                      if (response) {
                          const { result, code, status, msg } = response;
                          if(result == 1) {
        
                            toast.success('Huỷ đơn hàng đơn hàng thành công!', {
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
                        toast.error('Huỷ đơn hàng đơn hàng thất bại!', {
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
                    queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ORDERS_SHIPPER, query?.id?.toString()]});
                },
                
                }
            )
        }
    });
  
  };

  const onSubmitDoneOrder = () => {
     
    confirm({
        title: 'Bạn có chắc muốn hoàn tất đơn hàng này không?',
        icon: <ExclamationCircleFilled />,
        cancelText: 'Huỷ Bỏ',
        okText: 'Đồng ý',
        onOk() {
            doneOrder(
                {
                  id: query?.id
                },
                {
                  onSuccess: ( value ) => {
                      const response  = value.data
                        
                      if (response) {
                          const { result, code, status, msg } = response;
                          if(result == 1) {
        
                            toast.success('Hoàn tất đơn hàng đơn hàng thành công!', {
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
                        toast.error('Hoàn tất đơn hàng đơn hàng thất bại!', {
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
                    queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ORDERS_SHIPPER, query?.id?.toString()]});
                },
                
                }
            )
        }
    });
  
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const onSubmitDelivering = (values) => {
    setShipper(
      {
        id: query?.id,
        variables: {
          staffDelivery: values?.staffDelivery?.id
        }  
      },
      {
        onSuccess: ( value ) => {

            const response  = value.data
              
            if (response) {
                const { result, code, status, msg } = response;
                if(result == 1) {
                  toast.success('Phân nhân viên giao hàng thành công!', {
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
              toast.error('Phân nhân viên giao hàng thất bại!', {
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
          setIsModalOpen(false)
          reset(formValues => ({
              ...formValues,
              staffDelivery: null,
          }))  
          queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ORDERS_ADMIN, query?.id?.toString()]});
      },
      
      }
    )
  }
  return (
    <Card>
      <div className="flex flex-col lg:flex-row items-center">
        <div className="flex">
          <h3 className="text-2xl font-semibold text-heading text-center lg:text-start w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
            Mã đơn hàng: {data?.order?.id} - {data?.order?.status?.name}
          </h3>
        </div>
       
        <div
          className="flex items-start justify-end gap-2 ms-auto w-full lg:w-2/4"
        >
          {
            data?.order?.status?.id !== 4 &&  data?.order?.status?.id !== 5 &&
            <form onSubmit={handleSubmitDone(onSubmitDoneOrder)}>
              <Button htmlType="submit" type="primary" loading={loadingDone} className="flex items-center h-9" icon={<CheckCircleOutlined />}>
                <span className="block">
                    Hoàn tất
                </span>
              </Button>
            </form>
          } 
          
        </div>
      </div>

      <div className="my-5 lg:my-10 flex justify-center items-center">
        <Steps
            status={renderStatusProcess(data?.order?.status?.id)}
            current={renderCurrentStatus(data?.order?.status?.id)}
            items={renderListStatus(data?.order?.status?.id)}
        />
      </div>

      <div className="grid grid-cols-3 w-full gap-4 mb-6">
        <div className="flex items-center gap-1">
          <div className="font-base text-body">Mã khách hàng: </div>
          <span className="font-semibold">{data?.order?.customer?.id}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="font-base text-body">Tên khách hàng: </div>
          <span className="font-semibold"> {data?.order?.customer?.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="font-base text-body">Tên người nhận: </div>
          <span className="font-semibold"> {data?.order?.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="font-base text-body">SĐT người nhận: </div>
          <span className="font-semibold"> {data?.order?.phone}</span>
        </div>
        <div className="flex items-center gap-1 col-span-2">
          <div className="font-base text-body">Địa chỉ: </div>
          <span className="font-semibold"> {data?.order?.address}</span>
        </div> 
        {
          data?.order?.staffDelivery && 
          <div className="flex items-center gap-1 col-span-3">
            <div className="font-base text-body">Nhân viên giao: </div>
            <span className="font-semibold"> {data?.order?.staffDelivery?.name}</span>
          </div> 
        }
         {
          data?.order?.staffApprove && 
          <div className="flex items-center gap-1 col-span-3">
            <div className="font-base text-body">Nhân viên duyệt: </div>
            <span className="font-semibold"> {data?.order?.staffApprove?.name}</span>
          </div> 
        }
        
      </div>
      <div className="mb-10">
        {data?.order ? (
          <Table
            columns={columns}
            emptyText={"table:empty-table-data"}
            data={data?.order?.orderDetails}
            rowKey={(record) => record?.product?.id}
            scroll={{ x: 300 }}
          />
        ) : (
          <span>{"Không tìm thấy chi tiết đơn hàng"}</span>
        )}

        <div className="border-t-4 border-double border-border-200 flex flex-col w-full sm:w-1/2 md:w-1/3 ms-auto px-4 py-5 space-y-2 mt-4">
          <div className="flex items-center justify-between text-lg font-medium">
            <span>{"Tổng cộng"}</span>
            <span>{currencyMoney(calTotal())}</span>
          </div>
        </div>
      </div>

     
    </Card>
  );
}

OrderDetailsShipperPage.authenticate = {
  permissions: ["SHIPPER"],
};

OrderDetailsShipperPage.Layout = ShipperLayout;


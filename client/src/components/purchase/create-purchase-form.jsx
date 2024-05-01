import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";

import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo, useState, useEffect } from "react";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import Radio from "@components/ui/radio/radio";
import SwitchInput from "@components/ui/switch-input";
import BrandSelectInput from "@components/brand/brand-select-input";
import InputNumberOnly from "@components/ui/input-number";
import FileInput from "@components/ui/file-input";
import Button from "@components/ui/button";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Alert from "@components/ui/alert";
import RoleSelectInput from "@components/role/RoleSelectInput";
import { useCreatePosterMutation } from "@data/poster/admin/use-create-poster.mutation";
import { useUpdatePosterMutation } from "@data/poster/admin/use-update-poster.mutation";
import { toast } from "react-toastify";
import ValidationError from "@components/ui/form-validation-error";
import { DatePicker } from "@components/ui/date-picker";
import Search from "@components/common/search";
import SelectProductSearch from "@components/ui/select/select-product-search";
import { debounce, update } from "lodash";
import { useProductsQuery } from "@data/product/admin/use-products-admin.query";
import { InputNumber } from "antd";
import { formatDatePicker } from "@utils/format-date-picker";
import { useCreatePromotionMutation } from "@data/promotion/use-create-promotion.mutation";
import { useUpdatePromotionMutation } from "@data/promotion/use-update-promotion.mutation";
import formatDateDDMMYYYY from "@utils/format-date-dd-mm-yyyy";
import SupplierSelectInput from "@components/supplier/supplier-select-input";
import { useProductBySupplierQuery } from "@data/supplier/admin/use-get-product-supplier.query";
import { useCreatePurchaseOrderMutation } from "@data/purchase/admin/use-create-purchase-order.mutation";

const purchaseOrderDetailsSchema = {
  productId: yup.string().required("Product is required"),
  unitPrice: yup
    .number()
    .typeError("Giá phải là số")
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Vui lòng nhập giá"),
  quantity: yup
    .number()
    .integer()
    .typeError("Số lượng phải là số")
    .min(1, "Số lượng phải lớn hơn hoặc bằng 1")
    .required("Vui lòng nhập số lượng"),
};

const purchaseOrderValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã phiếu đặt").max(10, "Tối đa 10 ký tự"),
  supplier: yup
  .object()
  .required("Vui lòng chọn nhà cung cấp"),
  purchaseOrderDetails: yup.array()
  .min(1, "Cần ít nhất một chi tiết phiếu đặt")
  .of(yup.object().shape(purchaseOrderDetailsSchema))
});


const defaultValues = {
  purchaseOrderDetails: null
};


export default function CreateOrUpdatePurchaseForm({ initialValues }) {
  const [searchTerm, setSearchTerm] = useState(""); 
   
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const queryClient = useQueryClient();


  const { mutate: createPurchaseOrder, isLoading: creating } =
    useCreatePurchaseOrderMutation();


  


  const methods = useForm({
    resolver: yupResolver(purchaseOrderValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues
      ? {
          ...initialValues,
          id: initialValues?.id,
          supplier: initialValues?.id,
          purchaseOrderDetails: initialValues?.purchaseOrderDetails?.map(item => ({unitPrice: item?.unitPrice, productId: item.product?.id, quantity: item?.quantity}))
        }
      : defaultValues,
  });



  const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        setSearchTerm(value)
      };
      return debounce(loadOptions, 800);
  }, [800]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const [supplier, purchaseOrderDetails] = watch(["supplier", "purchaseOrderDetails"]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchaseOrderDetails",
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useProductBySupplierQuery(supplier?.id);


  


  const onSubmit = async (values) => {
    const input = {
      id: values?.id.toString().trim().toUpperCase(),
      supplier: values?.supplier?.id,
      purchaseOrderDetails: values?.purchaseOrderDetails
    };
    createPurchaseOrder({
      variables: {
          ...input
      },
    },
    {
      onSuccess: ( value ) => {
          const response  = value.data

          if (response) {
              const { result, data, code, status, msg } = response;
              if(result == 1) {
                toast.success('Thêm phiếu đặt thành công!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });  
                router.push('/admin/purchase')

              }
              else if(result == 0) {
                toast.success(msg, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });  
                return;
              }
          } else {
            toast.error('Thêm mới phiếu đặt thất bại!', {
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
            setErrorMessage(error?.response?.data?.msg)
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
      }
    );
    
  }


  function handleSearch({ searchText }) {
    setSearchTerm(searchText);
  }

  const handleAddDetailPurchase = () => {
    if(supplier?.id && data?.products.length > purchaseOrderDetails?.length) {
      append({ productId: null, unitPrice: null, quantity: null })
     
    }
    trigger("supplier")
  }
  
  return (
    <>
      {errorMessage ? (
        <Alert
          message={`common:${errorMessage}`}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
       <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Card  className="w-full">
              <Input
                label={"Mã phiếu đặt"}
                disabled={initialValues ? true : false}
                {...register("id")}
                error={errors.id?.message}
                variant="outline"
                className="mb-5 input-uppercase"
              />
              <SupplierSelectInput  
                control={control}
                error={(errors?.supplier)?.message}
              />
              
            </Card>
          </div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Card className="w-full">            
              <div>
                {fields.map((item, index) => (
                 
                  <div
                    className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                       <SelectProductSearch
                          label={"Sản phẩm"}
                          onSearch={debounceFetcher}
                          options={data?.products}
                          optionsDisable={purchaseOrderDetails.map(item=>item?.productId)}
                          isLoading={loading}
                          placeholder="Tìm tên sản phẩm..."
                          className="sm:col-span-2"
                          name="type"
                          {...register(`purchaseOrderDetails.${index}.productId`)}
                          error={errors?.purchaseOrderDetails?.[index]?.productId?.message}
                      />
                     
                      <InputNumberOnly 
                        min={1}
                        label={"Số lượng"}  
                        {...register(`purchaseOrderDetails.${index}.quantity`)} 
                        classNameParent="sm:col-span-1"  
                        addonAfter={"%"} 
                        className="h-[40px] w-full input-number-antd"  
                        error={errors?.purchaseOrderDetails?.[index]?.quantity?.message}
                      />
                      <InputNumberOnly 
                        label={"Giá"}  
                        {...register(`purchaseOrderDetails.${index}.unitPrice`)} 
                        classNameParent="sm:col-span-1"  
                        format={true}
                        addonAfter={"đ"} 
                        className="h-[40px] w-full input-number-antd"  
                        error={errors?.purchaseOrderDetails?.[index]?.unitPrice?.message}
                      />
                      <button
                        onClick={() => remove(index)}
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                      >
                        {"Xoá"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={handleAddDetailPurchase}
                className="w-full sm:w-auto h-9"
              >
                {"Thêm chi tiết phiếu đặt"}
              </Button>
              <ValidationError message={errors?.promotionDetails?.message}/>
            </Card>
          </div>
          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {"Trở lại"}
              </Button>
            )}
            <Button loading={creating} className="h-10">
              {"Thêm phiếu đặt"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

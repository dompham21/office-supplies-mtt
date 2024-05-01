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
import formatDateDDMMYYYY from "@utils/format-date-dd-mm-yyyy";
import { useCreateReceiptMutation } from "@data/receipt/admin/use-create-receipt.mutation";
import { usePurchaseOrdersQuery } from "@data/purchase/admin/use-purchase-orders-admin.query";
import PurchaseOrderSelectInput from "@components/purchase/purchase-order-select-input";


const receiptValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã phiếu nhập").max(10, "Tối đa 10 ký tự"),
  purchaseOrder: yup
  .object()
  .required("Vui lòng chọn phiếu đặt"),
});


const defaultValues = {
  purchaseOrder: null,
  
};


export default function CreateOrUpdateReceiptForm({ initialValues }) {


  const [searchTerm, setSearchTerm] = useState("");
   
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const queryClient = useQueryClient();


  const { mutate: createReceipt, isLoading: creating } =
    useCreateReceiptMutation();

  const methods = useForm({
    resolver: yupResolver(receiptValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues
      ? {
          ...initialValues,
          id: initialValues?.id,
          purchaseOrder: initialValues?.purchaseOrder?.id,
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
    formState: { errors },
  } = methods;

  const onSubmit = async (values) => {
    const input = {
      id: values?.id.toString().trim().toUpperCase(),
      purchaseOrder: values?.purchaseOrder?.id
    };    
    createReceipt({
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
                toast.success('Thêm phiếu nhập thành công!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });  
                router.push('/admin/receipt')

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
            toast.error('Thêm mới phiếu nhập thất bại!', {
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
                label={"Mã phiếu nhập"}
                disabled={initialValues ? true : false}
                {...register("id")}
                error={errors.id?.message}
                variant="outline"
                className="mb-5 input-uppercase"
              />

              <PurchaseOrderSelectInput  control={control}
                error={(errors?.purchaseOrder)?.message}/>
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
                {"Back"}
              </Button>
            )}
            <Button loading={creating} className="h-10">
              {"Nhập hàng"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

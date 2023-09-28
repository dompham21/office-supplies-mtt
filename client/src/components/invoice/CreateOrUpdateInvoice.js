import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import Radio from "@components/ui/radio/radio";
import SwitchInput from "@components/ui/switch-input";
import InputNumberOnly from "@components/ui/input-number";
import FileInput from "@components/ui/file-input";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Alert from "@components/ui/alert";
import RoleSelectInput from "@components/role/RoleSelectInput";
import { useCreateBrandMutation } from "@data/brand/admin/use-create-brand.mutation";
import { useUpdateBrandMutation } from "@data/brand/admin/use-update-brand.mutation";
import { toast } from "react-toastify";
import { Button } from "antd";
import removeVietnameseDiacritics, { REGEX_NAME_AND_NUMBER, REGEX_ONLY_NAME } from "@utils/format-text";
import { useCreateInvoiceMutation } from "@data/invoice/admin/use-create-invoice.mutation";

const invoiceValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã hoá đơn!").trim().max(10, "Mã hoá đơn tối đa 10 ký tự!") 
    .test({
        name: 'only-name-and-number',
        message: 'Mã hoá đơn chỉ được chứa ký tự và số',
        test: (item) => {
            const textCheck = removeVietnameseDiacritics(item);
            return !!textCheck.toLowerCase().match(REGEX_NAME_AND_NUMBER)?.[0];
        },
    }),
  name: yup.string().required("Vui lòng nhập tên!").trim().max(50, "Họ và tên tối đa 50 ký tự!").test({
    name: 'only-name-and-number',
    message: 'Họ và tên chỉ được chứa ký tự',
    test: (item) => {
            const textCheck = removeVietnameseDiacritics(item);
            return !!textCheck.toLowerCase().match(REGEX_ONLY_NAME)?.[0];
        },
    }),
  taxCode: yup.string().required("Vui lòng nhập mã số thuế!").trim().max(13, "Mã số thuế tối đa 13 ký tự!").min(10, "Mã số thuế tối thiểu 10 ký tự!")
});


const defaultValues = {
  id: "",
  name: "",
  taxCode: "",
};


export default function CreateOrUpdateInvoiceForm({ initialValues }) {

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();


  const { mutate: createInvoice, isLoading: creating } =
    useCreateInvoiceMutation();
  

  const methods = useForm({
    resolver: yupResolver(invoiceValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues
      ? initialValues
      : defaultValues,
    mode: 'all'
  });


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
      id: values.id.trim().toUpperCase(),
      name: values.name.trim(),
      orderId: router.query?.id,
      taxCode: values.taxCode.trim(),
    };

    createInvoice({
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
                    toast.success('Lập hoá đơn thành công!', {
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
                    return;
                }
            } else {
                toast.error('Lập hoá đơn thất bại!', {
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
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.INVOICE_ADMIN, router.query?.id?.toString()]});
        },    
        }
    );
    
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
        <div className="flex items-center justify-center my-4 text-base font-bold">Lập hoá đơn</div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex py-4 px-20 m-2 border border-dashed border-border-base">
            <Card className="w-full shadow-none">
                <Input
                label={"Mã đơn đặt hàng"}
                variant="outline"
                className="mb-5"
                value={router.query?.id}
                disabled={true}
              />
              <Input
                label={"Mã hoá đơn"}
                {...register("id")}
                error={errors.id?.message}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={"Họ và tên"}
                {...register("name")}
                error={errors.name?.message}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={"Mã số thuế"}
                {...register("taxCode")}
                error={errors.taxCode?.message}
                variant="outline"
                className="mb-5"
              />
            </Card>
          </div>
          <div className="mb-4 pt-2 text-end">
            <Button loading={creating} htmlType="submit" type="primary" className="h-10 px-8">
              {"Lập hoá đơn"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

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
import Button from "@components/ui/button";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Alert from "@components/ui/alert";
import { toast } from "react-toastify";
import { useUpdateSupplierMutation } from "@data/supplier/admin/use-update-supplier.mutation";
import { useCreateSupplierMutation } from "@data/supplier/admin/use-create-supplier.mutation";

const supplierValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã nhà cung cấp").max(10, "Mã nhà cung cấp không quá 10 ký tự"),
  name: yup.string().required("Vui lòng nhập tên nhà cung cấp").max(50, "Tên nhà cung cấp không quá 50 ký tự"),
  phone: yup.string().required("Vui lòng nhập số điện thoại").max(11, "Số điện thoại không quá 11 ký tự").min(10, "Số điện thoại ít nhất 10 ký tự"),
  address: yup.string().required("Vui lòng nhập  địa chỉ").max(100, "Địa chỉ nhà cung cấp không quá 100 ký tự"),
  website: yup.string().required("Vui lòng nhập website").max(100, "Địa chỉ website nhà cung cấp không quá 100 ký tự"),
  email: yup.string().email().required("Vui lòng nhập email").max(64, "Địa chỉ email tối đa 64 ký tự"),
  active: yup
      .boolean()
      .required("Vui lòng chọn trạng thái"),
 
});


const defaultValues = {
  id: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  website: "",
  active: true,
};


export default function CreateOrUpdateSupplierForm({ initialValues }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();


  const { mutate: createSupplier, isLoading: creating } =
    useCreateSupplierMutation();
  const { mutate: updateSupplier, isLoading: updating } =
    useUpdateSupplierMutation();

  const methods = useForm({
    resolver: yupResolver(supplierValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues
      ? {
          ...initialValues,
          active: initialValues?.isActive,
        }
      : defaultValues,
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
      id: values.id?.toString().trim().toUpperCase(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      website: values.website,
      address: values.address,
      isActive: values.active,
    };

    if(initialValues) { // updating
      updateSupplier({
        id: initialValues?.id,
        variables: {
            ...input
        },
      },
      {
        onSuccess: ( value ) => {
            const response  = value.data

            if (response) {
                const { result, code, status, msg} = response;
                if(result == 1) {
                    toast.success('Sửa thông tin nhà cung cấp thành công!', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });   

                    router.push('/admin/supplier')
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
              toast.error('Sửa thông tin nhà cung cấp thất bại!', {
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
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.SUPPLIERS_ADMIN, initialValues?.id?.toString()]});
        },            
      });
    }
    else {
      createSupplier({
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
                  toast.success('Thêm thông tin nhà cung cấp thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });   
                  router.push('/admin/supplier')

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
              toast.error('Thêm thông tin nhà cung cấp thất bại!', {
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

    
  }
  
  return (
    <>
      {errorMessage ? (
        <Alert
          message={`${errorMessage}`}
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
              <div className="flex flex-row w-full gap-2">
                <Input
                  label={"Mã nhà cung cấp*"}
                  disabled={initialValues ? true : false}
                  {...register("id")}
                  error={errors.id?.message}
                  variant="outline"
                  className="mb-5 input-uppercase w-1/2"
                />
                <Input
                  label={"Tên nhà cung cấp*"}
                  {...register("name")}
                  error={errors.name?.message}
                  variant="outline"
                  className="mb-5 w-1/2"
                />
              </div>
              <div className="flex flex-row w-full gap-2">
                <Input
                  label={"Số điện thoại*"}
                  {...register("phone")}
                  error={errors.phone?.message}
                  variant="outline"
                  className="mb-5 w-1/2"
                />
                <Input
                  label={"Email*"}
                  {...register("email")}
                  error={errors.email?.message}
                  variant="outline"
                  className="mb-5 w-1/2"
                  type="email"
                />
              </div>
             
               <Input
                label={"Website*"}
                {...register("website")}
                error={errors.website?.message}
                variant="outline"
                className="mb-5"
              />
              <TextArea
                label={"Địa chỉ*"}
                {...register("address")}
                error={errors.address?.message}
                variant="outline"
                className="mb-5"
              />
              <div>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Trạng thái*</label>
                <SwitchInput  name="active" control={control} errors={errors}/>
              </div>
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
            <Button loading={updating || creating}>
              {initialValues
                ? "Chỉnh sửa"
                : "Thêm mới"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

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
import RoleSelectInput from "@components/role/RoleSelectInput";
import { useCreateBrandMutation } from "@data/brand/admin/use-create-brand.mutation";
import { useUpdateBrandMutation } from "@data/brand/admin/use-update-brand.mutation";
import { toast } from "react-toastify";

const brandValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã thương hiệu"),
  name: yup.string().required("Vui lòng nhập tên thương hiệu"),
  description: yup.string().required("Vui lòng nhập mô tả"),
  active: yup
      .boolean()
      .required("Vui lòng chọn trạng thái"),
  image: yup.string().required("Vui lòng chọn hình ảnh"), 
 
});


const defaultValues = {
  id: "",
  name: "",
  description: "",
  active: true,
  image: null,
};


export default function CreateOrUpdateBrandForm({ initialValues }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();


  const { mutate: createBrand, isLoading: creating } =
    useCreateBrandMutation();
  const { mutate: updateBrand, isLoading: updating } =
    useUpdateBrandMutation();

  const methods = useForm({
    resolver: yupResolver(brandValidationSchema),
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
      description: values.description,
      active: values.active,
      image: values.image,
    };

    if(initialValues) { // updating
      updateBrand({
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
                    toast.success('Sửa thông tin thương hiệu thành công!', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });   

                    router.push('/admin/brand')
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
              toast.error('Sửa thông tin thương hiệu thất bại!', {
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
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.BRANDS_ADMIN, initialValues?.id?.toString()]});
        },            
      });
    }
    else {
      createBrand({
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
                  toast.success('Thêm thông tin thương hiệu thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });   
                  router.push('/admin/brand')

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
              toast.error('Thêm thông tin thương hiệu thất bại!', {
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
            <Description
              title={"Description"}
              details={"Edit your brand description and necessary information from here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />
            <Card  className="w-full sm:w-8/12 md:w-3/4">
              <Input
                label={"Mã thương hiệu*"}
                disabled={initialValues ? true : false}
                {...register("id")}
                error={errors.name?.message}
                variant="outline"
                className="mb-5 input-uppercase"
              />
              <Input
                label={"Tên thương hiệu*"}
                {...register("name")}
                error={errors.name?.message}
                variant="outline"
                className="mb-5"
              />
              <TextArea
                label={"Mô tả*"}
                {...register("description")}
                error={errors.description?.message}
                variant="outline"
                className="mb-5"
              />
              <div>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Trạng thái*</label>
                <SwitchInput  name="active" control={control} errors={errors}/>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={"Featured image"}
              details={"Upload your brand featured image here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-3/4">
              <FileInput name="image" control={control} error={(errors?.image)?.message} multiple={false} />
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
            <Button loading={updating || creating}>
              {initialValues
                ? "Update brand"
                : "Add brand"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

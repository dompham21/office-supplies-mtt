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
import CategorySelectInput from "@components/categories/category-select-input";
import BrandSelectInput from "@components/brand/brand-select-input";
import InputNumberOnly from "@components/ui/input-number";
import FileInput from "@components/ui/file-input";
import Button from "@components/ui/button";
import { useCreateProductMutation } from "@data/product/admin/use-create-product.mutation";
import { useUpdateProductMutation } from "@data/product/admin/use-update-product.mutation";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Alert from "@components/ui/alert";
import { useUpdateUserMutation } from "@data/user/admin/use-update-user.mutation";
import RoleSelectInput from "@components/role/RoleSelectInput";
import { toast } from "react-toastify";

const userValidationSchema = yup.object().shape({
  name: yup.string().required("form:error-name-required"),
  phone: yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(11, "Phone should be less than 11 characters and better than 10 characters")
    .min(10, "Phone should be less than 11 characters and better than 10 characters")
    .required("form:error-name-required"),
  email: yup
      .string()
      .email("form:error-price-must-number")
      .required("form:error-price-required"),
  active: yup
      .boolean()
      .required("form:error-password-required"),
  avatar: yup.string().required("form:error-name-required"), 
  roles: yup
    .array()
    .required("form:error-quantity-required"),
});


const defaultValues = {
  name: "",
  phone: "",
  email: "",
  active: true,
  avatar: null,
  roles: null,
};


export default function CreateOrUpdateUserForm({ initialValues }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();


//   const { mutate: createProduct, isLoading: creating } =
//     useCreateUser();
  const { mutate: updateUser, isLoading: updating } =
    useUpdateUserMutation();

  const methods = useForm({
    resolver: yupResolver(userValidationSchema),
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
      name: values.name,
      email: values.email,
      phone: values.phone,
      active: values.active,
      avatar: values.avatar,
      roles: values?.roles?.map(role => role?.id)

    };

    if(initialValues) { // updating
      updateUser({
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
                  toast.success('Sửa thông tin người dùng thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  router.push('/admin/user')
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
              toast.error('Sửa thông tin người dùng thất bại!', {
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
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.USERS_ADMIN, initialValues?.id?.toString()]});
        },            
      });
    }
    else {
    //   createProduct({
    //     variables: {
    //         ...input
    //     },
    //   },
    //   {
    //     onSuccess: ( value ) => {
    //         const response  = value.data

    //         if (response) {
    //             const { result, data, code, status, msg } = response;
    //             if(result == 1) {
    //               // api['success']({
    //               //   message: "Thông báo",
    //               //   description:
    //               //     'Thêm mới địa chỉ thành công!',
    //               //     duration: 1.5
    //               // });  
    //               router.push('/admin/product')

    //             }
    //             else if(result == 0) {
    //               setErrorMessage(msg);
    //                 return;
    //             }
    //         } else {
    //           setErrorMessage("form:error-credential-wrong");
    //         }
    //     },
    //     onError: (error) => {

    //         if(error?.msg) {
    //             if(error.code == 400) {
    //               setErrorMessage(error.msg)
    //             }
    //         }
    //         else {
    //           setErrorMessage("server is wrong")
    //         }
    //     },
    //     }
    //   );
    }

    
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
            <Description
              title={"Description"}
              details={"Edit your product description and necessary information from here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />
            <Card  className="w-full sm:w-8/12 md:w-3/4">
              <Input
                label={"Name*"}
                {...register("name")}
                error={errors.name?.message}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={"Email*"}
                {...register("email")}
                error={errors.email?.message}
                variant="outline"
                className="mb-5"
              />
            
              <Input
                label={"Phone*"}
                {...register("phone")}
                error={errors.phone?.message}
                variant="outline"
                className="mb-5"
              />
              <div>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Status*</label>
                <SwitchInput  name="active" control={control} errors={errors}/>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={"Roles"}
              details={"Select user roles from here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-3/4">
              <RoleSelectInput
                control={control}
                error={(errors?.roles)?.message}
              />
            </Card>
          </div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={"Featured avatar"}
              details={"Upload your user featured image here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-3/4">
              <FileInput name="avatar" control={control} error={(errors?.avatar)?.message} multiple={false} />
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
            <Button loading={updating}>
              {initialValues
                ? "Update user"
                : "Add User"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

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
import { toast } from "react-toastify";
import SupplierSelectInput from "@components/supplier/supplier-select-input";

const productValidationSchema = yup.object().shape({
  id: yup.string().required("Vui lòng nhập mã sản phẩm"),
  name: yup.string().required("Vui lòng nhập tên sản phẩm"),
  description: yup.string().required("Vui lòng nhập mô tả sản phẩm"),
  price: yup
      .number()
      .typeError("Giá phải là số")
      .min(0, "Giá phải lớn hơn hoặc bằng 0")
      .required("Vui lòng nhập giá"),
  active: yup
      .boolean()
      .required("Vui lòng chọn trạng thái sản phẩm"),
  images: yup.array().of(yup.string()).required("Vui lòng chọn hình ảnh sản phẩm"), 
  category: yup
    .object()
    .required("Vui lòng chọn danh mục sản phẩm"),
  supplier: yup
    .object()
    .required("Vui lòng chọn nhà cung cấp"),
  brand: yup
    .object()
    .required("Vui lòng chọn thương hiệu sản phẩm")
});


const defaultValues = {
  name: "",
  description: "",
  price: 0,
  active: true,
  images: null,
  category: null,
  brand: null,
  supplier: null,
  inStock: 0

};


export default function CreateOrUpdateProductForm({ initialValues }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();


  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();

  const methods = useForm({
    resolver: yupResolver(productValidationSchema),
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
      price: values.price,
      active: values.active,
      images: values.images,
      categoryId: values?.category?.id,
      brandId: values?.brand?.id,
      supplierId: values?.supplier?.id
    };

    if(initialValues) { // updating
      updateProduct({
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

                  toast.success("Sửa thông tin sản phẩm thành công!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  router.push('/admin/product')

                 
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
              toast.error('Sửa thông tin sản phẩm thất bại!', {
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
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.PRODUCTS, initialValues?.id?.toString()]});
        },            
      });
    }
    else {
      createProduct({
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
                  toast.success('Thêm mới sản phẩm thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  }); 
                  router.push('/admin/product')

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
              toast.error('Thêm mới sản phẩm thất bại!', {
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
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base px-10 my-5 sm:my-8">
         
            <Card  className="w-full">
              <Input
                label={"Mã sản phẩm*"}
                disabled={initialValues ? true : false}
                {...register("id")}
                error={errors.name?.message}
                variant="outline"
                className="mb-5 input-uppercase"
              />
              <Input
                label={"Tên sản phẩm*"}
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

             
              <CategorySelectInput
                control={control}
                error={(errors?.category)?.message}
              />
              <BrandSelectInput
                control={control}
                error={(errors?.brand)?.message}
              />
              <SupplierSelectInput
                control={control}
                error={(errors?.supplier)?.message}
              />
              <div>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Giá sản phẩm*</label>
                <InputNumberOnly format={true} name="price" control={control} error={(errors?.price)?.message}/>
              </div>
              <div className={`${initialValues ? 'block' : 'hidden'}`}>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Số lượng tồn</label>
                <InputNumberOnly readOnly={initialValues} format={true} name="inStock" control={control} error={(errors?.inStock)?.message}/>
              </div>
              <div>
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Trạng thái*</label>
                <SwitchInput  name="active" control={control} errors={errors}/>
              </div>
              <FileInput name="images" control={control} error={(errors?.images)?.message} multiple={true} />
              
             
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
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

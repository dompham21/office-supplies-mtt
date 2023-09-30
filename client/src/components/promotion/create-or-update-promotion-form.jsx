import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";

import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo, useState } from "react";
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

const promotionDetailsSchema = {
  productId: yup.number().required("Product is required"),
  percentage: yup.number()
    .min(0, "Percentage must be greater than or equal to 0")
    .max(100, "Percentage must be less than or equal to 100")
    .typeError("Percentage must be number")
    .integer("Percentage must be integer")
    .required("Percentage is required"),
};

const promotionValidationSchema = yup.object().shape({
  active: yup
      .boolean()
      .required("Active is required"),
  startDate: yup.string().required("Start Date is required"),
  finishDate: yup.string().required("Finish Date is required"),
  promotionDetails: yup.array()
  .min(1, "Should have 1 promotion details")
  .of(yup.object().shape(promotionDetailsSchema))
  .test("unique", "Each Product must be unique", function (values) {
    const ids = values.map((item) => item.productId);
    const uniqueIds = [...new Set(ids)]; // creates an array of unique ids
    return uniqueIds.length === ids.length; // returns true if all ids are unique
  })

});


const defaultValues = {
  startDate: null,
  finishDate: null,
  active: true,
  promotionDetails: null
};


export default function CreateOrUpdatePromotionForm({ initialValues }) {
  const [searchTerm, setSearchTerm] = useState("");

   
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const queryClient = useQueryClient();


  const { mutate: createPromotion, isLoading: creating } =
    useCreatePromotionMutation();
  const { mutate: updatePromotion, isLoading: updating } =
    useUpdatePromotionMutation();

  const {
    data,
    isLoading: loading,
    error,
  } = useProductsQuery(
      {
          pageSize: 10,
          sortField: "registrationDate",
          sortDirection: "desc",
          pageNo: 1,
          keyword: searchTerm
      }
  );

  const methods = useForm({
    resolver: yupResolver(promotionValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues
      ? {
          ...initialValues,
          active: initialValues?.active,
          finishDate: new Date(initialValues?.finishDate),
          startDate: new Date(initialValues?.startDate),
          promotionDetails: initialValues?.promotionDetails?.map(item => ({percentage: item?.percentage, productId: item.product?.id}))
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

  const [startDate, finishDate, values] = watch(["startDate", "finishDate", "values"]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "promotionDetails",
  });


  const onSubmit = async (values) => {
    const input = {
      startDate: formatDatePicker(values?.startDate),
      finishDate: formatDatePicker(values?.finishDate),
      active: values?.active,
      promotionDetails: values?.promotionDetails
    };


    if(initialValues) { // updating
      updatePromotion({
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
                    toast.success('Sửa thông tin promotion thành công!', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    }); 

                    router.push('/admin/promotion')
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
              toast.error('Sửa thông tin promotion thất bại!', {
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
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.POSTERS_ADMIN, initialValues?.id?.toString()]});
        },            
      });
    }
    else {
      createPromotion({
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
                  toast.success('Thêm promotion thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });  
                  router.push('/admin/promotion')

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
              toast.error('Thêm mới promotion thất bại!', {
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
            <Description
              title={"Description"}
              details={"Edit your poster description and necessary information from here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />
            <Card  className="w-full sm:w-8/12 md:w-3/4">

              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
                  <label>Start Date</label>

                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field: { onChange, onBlur, value } }) => (
                      //@ts-ignore
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                        selectsStart
                        minDate={new Date()}
                        maxDate={finishDate}
                        startDate={startDate}
                        endDate={finishDate}
                        className="border border-border-base"
                      />
                    )}
                  />
                  <ValidationError message={(errors.startDate?.message)} />
                </div>
                <div className="w-full sm:w-1/2 p-0 sm:ps-2">
                  <label>Finish Date</label>

                  <Controller
                    control={control}
                    name="finishDate"
                    render={({ field: { onChange, onBlur, value } }) => (
                      //@ts-ignore
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                        selectsEnd
                        startDate={startDate}
                        endDate={finishDate}
                        minDate={startDate}
                        className="border border-border-base"
                      />
                    )}
                  />
                  <ValidationError message={(errors.finishDate?.message)} />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Status*</label>
                <SwitchInput name="active" control={control} errors={errors}/>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={"Featured image"}
              details={"Upload your poster featured image here"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/4 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-3/4">            
              <div>
                {fields.map((item, index) => (
                 
                  <div
                    className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8"
                    key={item.id }
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                       <SelectProductSearch
                          label={"Product"}
                          onSearch={debounceFetcher}
                          options={data?.products}
                          isLoading={loading}
                          placeholder="Search product name here..."
                          className="sm:col-span-3"
                          name="type"
                          {...register(`promotionDetails.${index}.productId`)}
                          error={errors?.promotionDetails?.[index]?.productId?.message}
                          defaultValue={item.productId} // make sure to set up defaultValue
                      />
                     
                      <InputNumberOnly 
                        min={0} max={100}
                        label={"Percentage"}  
                        {...register(`promotionDetails.${index}.percentage`)} 
                        classNameParent="sm:col-span-1"  
                        addonAfter={"%"} 
                        className="h-[48px] w-full input-number-antd"  
                        defaultValue={item.percentage}
                        error={errors?.promotionDetails?.[index]?.percentage?.message}
                      />
                      <button
                        onClick={() => remove(index)}
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                      >
                        {"Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => append({ productId: null, percentage: null })}
                className="w-full sm:w-auto"
              >
                {"Add promotion detail"}
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
                {"Back"}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? "Update promotion"
                : "Add promotion"}
            </Button>
          </div>
        </form>
       </FormProvider>
    </>
  );
}

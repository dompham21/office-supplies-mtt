import ValidationError from '@components/ui/form-validation-error';
import Input from '@components/ui/input';
import InputNumberOnly from '@components/ui/input-number';
import SelectProductSearch from '@components/ui/select/select-product-search';
import { useProductsQuery } from '@data/product/admin/use-products-admin.query';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, notification } from 'antd';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MdClear } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import * as yup from "yup";

const promotionDetailsSchema = {
    productId: yup.number().required("Product is required"),
    number: yup.number()
      .min(0, "Percentage must be greater than or equal to 0")
      .typeError("Percentage must be number")
      .integer("Percentage must be integer")
      .required("Percentage is required"),
    price: yup
      .number()
      .typeError("form:error-price-must-number")
      .min(0, "form:error-price-must-positive")
      .required("form:error-price-required"),
  };
  
const promotionValidationSchema = yup.object().shape({
    promotionDetails: yup.array()
    .min(1, "Phải có ít nhất một sản phẩm")
    .of(yup.object().shape(promotionDetailsSchema))
    .test("unique", "Sản phẩm phải là duy nhất", function (values) {
        const ids = values.map((item) => item.productId);
        const uniqueIds = [...new Set(ids)]; // creates an array of unique ids
        return uniqueIds.length === ids.length; // returns true if all ids are unique
    })

});
  
  
const defaultValues = {
    promotionDetails: {
        productId: null,
        number: null,
        price: null
    }
};

  
function CreateOrUpdateImportForm({ initialValues }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);


   
    
    const router = useRouter();
  
    const queryClient = useQueryClient();

    const {
        data,
        isLoading: loading,
        error,
      } = useProductsQuery(
          {
              pageSize: 20,
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
              promotionDetails: initialValues?.promotionDetails?.map(item => ({number: item?.number, productId: item.product?.id, price: item?.price}))
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "promotionDetails",
    });


    const onSubmit = (data) => {
        console.log(data)
    }

    const getTotal = (number, price) => {
        const total = number * price;
        let result;
        console.log(total)
        if(total) return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return total
    }

  return (
    <Fragment>
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
                <Card className="w-full">            
                    <div>
                    {fields.map((item, index) => (
                        <div className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8" key={item.id}>
                            <div className="flex items-start gap-5 h-22">
                                <Input 
                                    className="w-28"
                                    name="type"
                                    type="text"
                                    label={"ID sản phẩm"}
                                    readOnly={true}
                                    value={watch(`promotionDetails.${index}.productId`, null)}
                                />
                                <SelectProductSearch
                                    label={"Chọn sản phẩm"}
                                    onSearch={debounceFetcher}
                                    options={data?.products}
                                    isLoading={loading}
                                    placeholder="Search product name here..."
                                    className="sm:col-span-3 w-[360px]"
                                    name="type"
                                    {...register(`promotionDetails.${index}.productId`)}
                                    error={errors?.promotionDetails?.[index]?.productId?.message}
                                    defaultValue={item.productId} // make sure to set up defaultValue
                                />
                                
                                <InputNumberOnly 
                                    min={0}
                                    label={"Số lượng"}  
                                    {...register(`promotionDetails.${index}.number`)} 
                                    classNameParent="sm:col-span-1"  
                                    className="h-[40px] w-full input-number-antd"  
                                    defaultValue={item.percentage}
                                    error={errors?.promotionDetails?.[index]?.number?.message}
                                />
                                <InputNumberOnly 
                                    min={0} 
                                    label={"Giá nhập"}  
                                    defaultValue={item.price}  
                                    format={true} 
                                    {...register(`promotionDetails.${index}.price`)} 
                                    error={errors?.promotionDetails?.[index]?.price?.message}
                                />
                                <Input
                                    name={"total"}
                                    label={"Thành tiền"} 
                                    readOnly={true} 
                                    format={true} 
                                    value={getTotal(watch(`promotionDetails.${index}.price`, null), watch(`promotionDetails.${index}.number`, null))}
                                />
                                <div
                                    onClick={() => remove(index)}
                                    className="cursor-pointer flex flex-grow justify-center items-center h-full text-2xl text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
                                >
                                   <MdClear/>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        onClick={() => append({ productId: null, price: null, number: null })}
                        className="w-auto bg-accent text-white"
                    >
                        {"Thêm Sản Phẩm"}
                    </Button>
                    <ValidationError message={errors?.promotionDetails?.message}/>
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
                    <Button htmlType='submit'>
                    {initialValues
                        ? "Update promotion"
                        : "Add promotion"}
                    </Button>
                </div>
                </Card>
               
            </form>
        </FormProvider>
    </Fragment>

  )
}

export default CreateOrUpdateImportForm
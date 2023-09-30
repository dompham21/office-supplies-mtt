import { Select, Spin } from "antd";
import { Controller } from "react-hook-form";
import debounce from 'lodash/debounce';
import React,{ useEffect, useMemo, useRef, useState } from 'react';
import { useProductsQuery } from "@data/product/admin/use-products-admin.query";
import cn from "classnames";
import ValidationError from "../form-validation-error";

const SelectProductSearch =  React.forwardRef((props, ref) => {
    const { Option } = Select;

    const {
        id,
        control,
        options,
        optionsDisable,
        name,
        rules,
        value,
        label,
        handleOnChange,
        isMulti,
        isClearable,
        isLoading,
        placeholder,
        onSearch,
        className,
        error,
        ...rest
    } = props;
    

    console.log(optionsDisable)
  
    return (
        <div className={className}> 
            <label
                className="block text-body-dark font-semibold text-sm leading-none mb-3"
            >
                {label}
            </label>
            <Controller
            control={control}
            name={name}
            rules={rules}
            {...rest}
            render={({ field }) => (
                <Select
                    className={cn(className, "w-full h-[40px] select-antd")}
                    filterOption={false}
                    showSearch
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    onSearch={onSearch}
                    {...field}  

                    onChange={(e) => {
                        field.onChange(e)
                    }}
                    notFoundContent={isLoading ? <Spin size="small" /> : null}
                >
                    {
                        options?.map(item => (
                            <Option key={item.id} value={item.id} disabled={optionsDisable.includes(item.id)}>
                                <div>
                                    {item.name}
                                </div>
                            </Option>
                        ))
                    }
                </Select>
                
            )}
            />
            <ValidationError message={error} />
        </div>
    );
});

SelectProductSearch.displayName = 'select-product'
export default SelectProductSearch;

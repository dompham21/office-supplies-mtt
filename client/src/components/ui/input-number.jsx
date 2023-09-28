import React from 'react'
import cn from "classnames";
import { Controller } from 'react-hook-form';
import Input from './input';
import { InputNumber } from 'antd';
import ValidationError from './form-validation-error';



const InputNumberOnly = React.forwardRef((props, ref) => {
  const { addonAfter,classNameParent, className, control, label, name, error, format, min, max, readOnly = false} = props
  return (
    <div className={classNameParent}> 
    {
      label ?  
      <label
          className="block text-body-dark font-semibold text-sm leading-none mb-3"
      >
          {label}
      </label> : null
    }
     
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
        <InputNumber
          ref={ref}
          readOnly={readOnly}
          addonAfter={addonAfter}
          min={min || 0}
          max={max}
          formatter={format ? (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
          parser={format ? (value) => value?.replace(/\$\s?|(,*)/g, '') : null}
          value={value}
          onChange={onChange}
          className={cn(!className ? "mb-5 px-4 h-10 border border-border-base focus:border-accent flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0" 
          : className) }
          /> 
      
      )}
      />
      <ValidationError message={error} />
    </div>
   
  )
})

InputNumberOnly.displayName = "InputNumberOnly"
export default InputNumberOnly
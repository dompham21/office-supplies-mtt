import { Select } from "antd";
import { Controller } from "react-hook-form";


const SelectAntd = ({
  id,
  control,
  options,
  name,
  rules,
  value,
  onChange,
  isMulti,
  isClearable,
  isLoading,
  placeholder,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field }) => (
        <Select
          className="w-full h-[40px] select-antd"
          showSearch
          defaultActiveFirstOption={false}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          allowClear={isClearable}
          loading={isLoading}
          options={(options).map((d) => ({
            value: d.id,
            label: d.name,
          }))}
          {...field}
        />
      )}
    />
  );
};

export default SelectAntd;

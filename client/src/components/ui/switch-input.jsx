import { Control, Controller, FieldErrors } from "react-hook-form";
import { Switch } from "@headlessui/react";
import ValidationError from "./form-validation-error";
import { useTranslation } from "next-i18next";


const SwitchInput = ({ control, label, name, errors }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-1">{label}</div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Switch
            checked={value}
            onChange={onChange}
            className={`${
              value ? "bg-accent" : "bg-gray-200"
            } relative inline-flex items-center h-6 rounded-full w-11`}
          >
            <span className="sr-only">Enable {label}</span>
            <span
              className={`${
                value ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-light rounded-full`}
            />
          </Switch>
        )}
      />
      <p className="my-2 text-xs text-start text-red-500">{t(errors?.[name]?.message)}</p>
    </div>
  );
};

export default SwitchInput;

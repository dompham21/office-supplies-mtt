import Uploader from "@components/common/uploader";
import { Controller } from "react-hook-form";
import ValidationError from "./form-validation-error";

const FileInput = ({ control, name, error, multiple }) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { ref, ...rest } }) => (
          <Uploader {...rest} multiple={multiple} />
        )}
      />
       <ValidationError message={error} />
    </>
    
  );
};

export default FileInput;

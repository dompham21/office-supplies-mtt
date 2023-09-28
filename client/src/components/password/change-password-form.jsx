import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import PasswordInput from "@components/ui/password-input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useChangePasswordMutation } from "@data/password/use-change-password.mutation";
import Alert from "@components/ui/alert";
import { useState } from "react";
import { toast } from "react-toastify";


const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("form:error-old-password-required"),
  newPassword: yup.string().required("form:error-password-required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "form:error-match-passwords")
    .required("form:error-confirm-password"),
});

const ChangePasswordForm = () => {
    const [errorMsg, setErrorMsg] = useState("");

  const { mutate: changePassword, isLoading: loading } = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  async function onSubmit(values) {
    changePassword(
      {
        variables: {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        },
      },
      {
        onError: (error) => {
          if(error?.response?.status == 400) {
            if(error?.response?.data?.msg) {
              setErrorMsg(error?.response?.data?.msg)

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
        onSuccess: ( value ) => {
            const response  = value.data

            if (response) {
                const { result, data, code, status, msg } = response;
                if(result == 1) {
                  toast.success('Đổi mật khẩu thành công!', {
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
                else if(result == 0) {
                    setErrorMsg(msg);
                    return;
                }
            } else {
                toast.error('Đổi mật khẩu thất bại!', {
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
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='px-[30px]'>
      <div className="flex flex-wrap my-5 sm:my-8">


        <div className="w-full sm:w-8/12 md:w-2/3 mb-5">
            {errorMsg ? (
                <Alert
                    message={errorMsg}
                    variant="error"
                    closeable={true}
                    className="mb-5"
                    onClose={() => setErrorMsg("")}
                />
                ) : null}
          <PasswordInput
            label={"Old Password"}
            {...register("oldPassword")}
            variant="outline"
            error={errors.oldPassword?.message}
            className="mb-5"
            style={{fontSize: '16px'}}
          />
          <PasswordInput
            label={"New Password"}
            {...register("newPassword")}
            variant="outline"
            error={errors.newPassword?.message}
            className="mb-5"
            style={{fontSize: '16px'}}
          />
          <PasswordInput
            label={"Confirm Password"}
            {...register("confirmPassword")}
            variant="outline"
            error={errors.confirmPassword?.message}
            style={{fontSize: '16px'}}
          />
           <div className="w-full flex justify-start mt-8">
                <Button loading={loading} disabled={loading}>
                    {"Cập nhật"}
                </Button>
            </div>
        </div>

       
      </div>
    </form>
  );
};
export default ChangePasswordForm;

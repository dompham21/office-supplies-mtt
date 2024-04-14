import React, { useEffect } from 'react'
import Logo from "@components/ui/logo";
import LoginForm from "@components/auth/login-form";
import { GetStaticProps } from "next";
import { ROUTES } from "@utils/routes";
import { useRouter } from "next/router";
import { getAuthCredentials, isAuthenticated } from '@utils/auth-utils';
import Link from 'next/link';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Input from '@components/ui/input';
import { useForgotPasswordMutation } from '@data/user/use-forgot-password.mutation';
import { toast } from 'react-toastify';
import Alert from '@components/ui/alert';
import PasswordInput from '@components/ui/password-input';
import { useForgotPasswordConfirmMutation } from '@data/user/use-forgot-password-confirm.mutation';

const validateSchema = yup.object().shape({
  newPassword: yup.string().required("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp")
    .required("Vui lòng nhâp xác nhận mật khẩu"),
});

const defaultValues = {
    email: null,
    otp: null,
    newPassword: null,
    confirmPassword: null
};

function ForgotConfirmPage() {
    const router = useRouter();
    const { mutate: forgot, isLoading: loading } = useForgotPasswordConfirmMutation();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validateSchema),
    });

    useEffect(() => {
      setValue("otp", localStorage.getItem("token_forgot") || "")
      setValue("email", localStorage.getItem("email_verify_forgot") || "")
    }, [])

    const onSubmit = async ({newPassword, confirmPassword, otp, email}) => {
        forgot(
            {
              variables: {
                newPassword,
                confirmPassword,
                otp,
                email
              },
            },
      
            {
              onSuccess: (value) => {
                const response = value.data;
      
                if (response) {
                  const {
                    msg,
                    result
                  } = response;
                  if (result == 1) {
                    toast.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại", {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light',
                    });
                    localStorage.removeItem("email_verify_forgot")
                    localStorage.removeItem("token_forgot")

                    router.push(ROUTES.LOGIN);
                  } else if (result == 0) {
                    toast.error(msg, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                      });
                    return;
                  }
                } else {
                  toast.error('Thất bại thử lại sau!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  });
                }
              },
              onError: (error) => {
                if (error?.response?.status == 400) {
                  if (error?.response?.data?.msg) {   
                    console.log(error)   
                    toast.error(error?.response?.data?.msg, {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light',
                    });
                  }
                } else {
                  toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  });
                }
              },
            }
          );
      }
    return (
        <div className="flex items-center justify-center h-screen bg-light sm:bg-gray-100">
            <div className="m-auto max-w-md w-full bg-light sm:shadow p-5 sm:p-8 rounded">
                <div className="flex justify-center mb-2">
                    <Logo />
                </div>
                <h3 className="text-center text-2xl font-bold mt-8 mb-16">
                   Đổi mật khẩu
                </h3>
                <div className="flex flex-col items-center justify-center  p-2 antialiased text-gray-900">
                    <div className="w-full max-w-lg bg-white rounded-md py-2">
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap w-full">
                          <div className="w-full mb-5">
                            <Input
                              {...register('email')}
                              type="hidden"
                            />   
                            <Input
                              {...register('otp')}
                              type="hidden"
                            /> 
                            <PasswordInput
                              label={"Mật khẩu mới"}
                              {...register("newPassword")}
                              variant="outline"
                              error={errors.newPassword?.message}
                              className="mb-5"
                              style={{fontSize: '16px'}}
                            />
                            <PasswordInput
                              label={"Xác nhận mật khẩu"}
                              {...register("confirmPassword")}
                              variant="outline"
                              error={errors.confirmPassword?.message}
                              style={{fontSize: '16px'}}
                            />
                            <div className="w-full flex justify-center mt-8">
                                  <Button loading={loading} disabled={loading}>
                                      {"Cập nhật"}
                                  </Button>
                              </div>
                          </div>
                        </div>
                      </form>     
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotConfirmPage
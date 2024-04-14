import React from 'react'
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

const validationSchema = yup.object().shape({
    email: yup
    .string()
    .email("Địa chỉ email không đúng định dạng!")
    .required("Vui lòng nhập địa chỉ email!")
    .trim(),
});

const defaultValues = {
    email: null
};

function ForgotPage() {
    const router = useRouter();
    const { mutate: forgot, isLoading: loading } = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
    
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async ({email}) => {
        forgot(
            {
              variables: {
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
                    toast.success("Gửi OTP thành công vui lòng xác thực!", {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light',
                    });
                    localStorage.setItem("email_verify_forgot", email)
      
                    router.push(ROUTES.VERIFY_FORGOT);
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
                    setErrorMessage(error?.response?.data?.msg);
      
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
                     Quên mật khẩu
                </h3>
                <div class="flex flex-col items-center justify-center  p-2 antialiased text-gray-900">
                    <div class="w-full max-w-lg bg-white rounded-md py-2">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            label={"Nhập địa chỉ email của bạn"}
                            {...register("email")}
                            type="email"
                            variant="outline"
                            className="mb-4"
                            error={errors?.username?.message}
                        />
                        <Button className="w-full" loading={loading} disabled={loading}>{"Gửi OTP"}</Button>
                    </form>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPage
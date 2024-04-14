import Logo from "@components/ui/logo";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";
import RegistrationFormSeller from "@components/auth/registration-form-seller";
import Button from "@components/ui/button";
import { useEffect, useMemo, useState } from "react";
import InputNumberOnly from "@components/ui/input-number";
import * as yup from "yup";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputOTP } from "antd-input-otp";
import Input from "@components/ui/input";
import { useVerifySellerMutation } from "@data/user/seller/use-verify-seller.mutation";
import { toast } from 'react-toastify';
import { useResendSellerMutation } from "@data/user/seller/use-resend-seller.mutation";
import { Button as ButtonAntd } from 'antd';
import { useVerifyForgotMutation } from "@data/user/use-verify-forgot.mutation";
import { useResendForgotMutation } from "@data/user/use-resend-forgot.mutation";

const validationSchema = yup.object().shape({
    username: yup.string().required("Không có email để xác thực"),
    otp: yup
        .array()
        .of(yup.string().required('Vui lòng nhập OTP').matches(/^\d{1}$/, 'Vui lòng nhập OTP'))
        .required('Vui lòng nhập OTP')
        .min(6, 'Vui lòng nhập OTP')
        .max(6, 'Vui lòng nhập OTP'),
});

const defaultValues = {
    username: null,
    otp: null
};

export default function VerifyPage() {
  const router = useRouter();
  const [value, setValueEmail] = useState("")
  const { mutate: verify, isLoading: loading } = useVerifyForgotMutation();
  const { mutate: resend, isLoading: loadingResend } = useResendForgotMutation();

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

const [otp, username] = watch(["otp", "username"]);

  useEffect(() => {
    setValueEmail(localStorage.getItem("email_verify_forgot") || "")
    setValue("username", localStorage.getItem("email_verify_forgot") || "")
  }, [])

  const onSubmit = async ({otp, username}) => {
    verify(
        {
          variables: {
            otp: otp?.join("") | "",
            username
          },
        },
  
        {
          onSuccess: (value) => {
            const response = value.data;
  
            if (response) {
              const {
                msg,
                result,
                otp, 
                email
              } = response;
              if (result == 1) {
                toast.success("Xác thực thành công!", {
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
                localStorage.setItem("token_forgot", otp)
  
                router.push(ROUTES.CONFIRM_FORGOT);
              } else if (result == 0) {
                toast.error('Xác thực thất bại thử lại sau!', {
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
              toast.error('Xác thực thất bại thử lại sau!', {
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

  const resendCode = ()  => {
    resend(
        {
          variables: {
            email: username
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
                toast.success("Gửi lại otp thành công!", {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'light',
                });
  
              } else if (result == 0) {
                toast.error('Gửi lại otp thất bại thử lại sau!', {
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
              toast.error('Gửi lại otp thất bại thử lại sau!', {
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
    <div className="flex items-center justify-center h-screen bg-white sm:bg-gray-100">
      <div className="m-auto max-w-md w-full bg-white sm:shadow p-5 sm:p-8 rounded">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <div className="bg-white h-96 py-3 rounded text-center">
            <h1 className="text-2xl font-bold">Xác Thực OTP</h1>
            <div className="flex flex-col mt-4">
                <span>Nhập OTP nhận từ email: </span>
                <span className="font-bold">{value}</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                    <Input
                        {...register('username')}
                        type="hidden"
                    />                
                    <Controller
                        control={control}
                        render={({ field, fieldState }) => (
                        <div>
                            <InputOTP {...field} length={6} />
                        </div>
                        )}
                        name="otp"
                    />
                </div>    
               
                {errors.otp &&  <p className="my-2 text-xs text-start text-red-500">{errors.otp.message }</p>}    
                {errors.username &&  <p className="my-2 text-xs text-start text-red-500">{errors.username.message }</p>}            
        
                <div className="flex justify-center items-end text-center mt-5 flex-col w-full">
                    <Button className="w-full" loading={loading} disabled={loading}>
                        Xác thực
                    </Button>
                    <ButtonAntd onClick={resendCode} className="mt-2" loading={loadingResend}  disabled={loadingResend} type="text">Gửi lại OTP</ButtonAntd>
                </div>
            </form>
            
        </div>
      </div>
    </div>
  );
}

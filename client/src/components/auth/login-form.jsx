import React, { useState } from 'react'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ROUTES } from "@utils/routes";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import Input from "@components/ui/input";
import PasswordInput from '@components/ui/password-input';
import { useTranslation } from "next-i18next";
import { useLoginMutation } from "src/query/user/use-login.mutation";
import { setAuthCredentials } from '@utils/auth-utils';
import Link from 'next/link';
import { toast } from 'react-toastify';

const loginFormSchema = yup.object().shape({
    username: yup
    .string()
    .email("Địa chỉ email không đúng định dạng!")
    .required("Vui lòng nhập địa chỉ email!")
    .trim(),
    password: yup.string().required("Vui lòng nhập mật khẩu!").trim()
    .min(3, "Mật khẩu phải có tối thiểu 3 ký tự!"),
});

const defaultValues = {
    username: "",
    password: "",
};

function LoginForm() {
    const { mutate: login, isLoading: loading } = useLoginMutation();
    const [errorMsg, setErrorMsg] = useState("");
    const { t } = useTranslation();
    const router = useRouter();

    const {
        register,
        handleSubmit,
    
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(loginFormSchema),
    });

    function onSubmit({ username, password }) {
        login(
            {
            variables: {
                username,
                password,
            },
            },
            {
            onSuccess: ( value ) => {
                const response  = value.data

                if (response) {
                    const { result, data, code, status, msg, refreshToken, accessToken } = response;
                    if(result == 1) {
                        const roles = data?.role; // List roles of user
                        console.log(data?.role)
                        setAuthCredentials(accessToken, roles);
                        
                        toast.success('Đăng nhập thành công!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        router.push(ROUTES.DASHBOARD);
                    }
                    else if(result == 0) {
                        setErrorMsg(msg);
                        return;
                    }
                } else {
                    toast.error('Đăng nhập thất bại!', {
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
            }
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {errorMsg ? (
                <Alert
                    message={errorMsg}
                    variant="error"
                    closeable={true}
                    className="mb-5"
                    onClose={() => setErrorMsg("")}
                />
                ) : null}
                <Input
                    label={"Email"}
                    {...register("username")}
                    type="email"
                    variant="outline"
                    className="mb-4"
                    error={errors?.username?.message}
                />
                <PasswordInput
                    {...register("password")}
                    label={"Mật khẩu"}
                    forgotPassHelpText={"Quên mật khẩu"}
                    type="text"
                    variant="outline"
                    className="mb-4"
                    forgotPageLink="/forgot-password"
                    error={errors?.password?.message}
                />
                <Button className="w-full" loading={loading} disabled={loading}>Login</Button>
                <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
                    <hr className="w-full" />
                    <span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
                        Or
                    </span>
                </div>
                <div className="text-sm sm:text-base text-body text-center">
                {"Chưa có tài khoản "}
                <Link
                    href="/register"
                    scroll={false}
                    className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-700 hover:no-underline focus:no-underline"
                >
                    Đăng ký
                </Link>
                </div>
            </form>
            
        </div>
  )
}

export default LoginForm
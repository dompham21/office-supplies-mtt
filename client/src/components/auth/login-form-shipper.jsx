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
import { useLoginAdminMutation } from '@data/user/use-login-admin.mutation';
import { useLoginShipperMutation } from '@data/user/use-login-shipper.mutation';

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

function LoginFormShipper() {
    const { mutate: login, isLoading: loading } = useLoginShipperMutation();
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
        mode: 'all'
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
                        router.push(ROUTES.SHIPPER_DASHBOARD);
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
                    label={"Password"}
                    forgotPassHelpText={"Quên mật khẩu"}
                    type="email"
                    variant="outline"
                    className="mb-4"
                    forgotPageLink="/forgot-password"
                    error={errors?.password?.message}
                />
                <Button className="w-full" loading={loading} disabled={loading}>{"Login"}</Button>
            </form>
            
        </div>
  )
}

export default LoginFormShipper
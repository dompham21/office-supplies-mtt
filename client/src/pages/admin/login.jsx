import React from 'react'
import Logo from "@components/ui/logo";
import LoginForm from "@components/auth/login-form";
import { GetStaticProps } from "next";
import { ROUTES } from "@utils/routes";
import { useRouter } from "next/router";
import { getAuthCredentials, isAuthenticated } from '@utils/auth-utils';
import LoginFormAdmin from '@components/auth/login-form-admin';

function LoginPageAdmin() {
    const router = useRouter();

    const { token, permissions }  = getAuthCredentials();
    

    // if (isAuthenticated({ accessToken, roles })) {
    //     router.replace(ROUTES.DASHBOARD);
    // }

    return (
        <div className="flex items-center justify-center h-screen bg-light sm:bg-gray-100">
            <div className="m-auto max-w-md w-full bg-light sm:shadow p-5 sm:p-8 rounded">
                <div className="flex justify-center mb-2">
                    <Logo />
                </div>
                <h3 className="text-center text-base italic text-body mb-6 mt-4">
                    Login to admin
                </h3>
                <LoginFormAdmin />
            </div>
        </div>
    )
}

export default LoginPageAdmin
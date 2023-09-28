import React, { Fragment, use, useEffect, useMemo, useState } from 'react'
import Logo from '@components/ui/logo';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Search from '@components/ui/search/search';
import { getAuthCredentials, isAuthenticated } from '@utils/auth-utils';
import AuthorizedMenu from './menu/authorized-menu';
import CartMenu from './menu/cart-menu';
import { useRouter } from 'next/router';
import { AUTH_CRED, REFRESHTOKEN } from '@utils/constants';
import useAuthenticated from './useIsAuthenticated';
import { Button, Spin } from 'antd';
import { useAtom } from 'jotai';
import { authorizationAtom } from 'src/hook/authorization-atom';
import { useProfileQuery } from '@data/profile/use-profile.query';

function Header() {
    const router = useRouter();
    const handleRedirectToLogin = () => {
        router.push("/login")
    }

    const { data, isLoading: loading, error } = useProfileQuery();


  

    return (
        <header className="h-14 md:h-16 lg:h-22 w-full top-0 z-50">
            <div className="flex justify-between items-center w-full h-14 md:h-16 lg:h-22 px-8 lg:px-20 py-5 z-50  bg-white border-b border-border-200 shadow-sm transition-transform duration-300">
                <div className="flex items-center w-full lg:w-auto">
                    <Logo className="mx-auto lg:mx-0 inline-flex" />
                </div>
                <div className="hidden lg:block w-full xl:w-3/4 2xl:w-10/12 mx-auto px-10 overflow-hidden">
                    <Search label="Search your products from here..." variant="minimal" />
                </div>
                <ul className="hidden mb-0 lg:flex items-center flex-shrink-0 space-s-10">
                
                    {
                        loading ? <Spin/> :  data?.user ? 
                        <Fragment>
                          <li><CartMenu/></li>
                          <li><AuthorizedMenu user={data?.user}/></li>
                        </Fragment>
                         :    
                         <li><Button className="w-[130px] h-10" loading={false} type='primary' disabled={false} onClick={handleRedirectToLogin}>Đăng nhập</Button></li>
                    }
                  
                </ul>
            </div>
        </header>
    )
}

export default Header
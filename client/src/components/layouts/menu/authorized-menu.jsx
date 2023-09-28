import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@components/ui/avatar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { default as avatarPlaceholder } from '@assets/placeholders/avatar.png';
import { siteSettings } from '@settings/site.settings';
import { Popover } from 'antd';
import { AUTH_CRED, REFRESHTOKEN } from '@utils/constants';
import Cookies from 'js-cookie';
export default function AuthorizedMenu({user}) {
  
  const router = useRouter();

  function handleClick(path) {
    router.push(path);
  }

  const handleLogout = () => {
    Cookies.remove(AUTH_CRED)
    router.replace("/login");
  }

  const content = (
    <>
      <li className='min-w-[150px]'>
        <button
          onClick={() => handleClick("/user/profile")}
          className='rounded block w-full py-2.5 px-6 text-sm text-start font-semibold capitalize text-heading transition duration-200 hover:text-accent hover:bg-gray-100 focus:outline-none'            >
          {"Tài khoản của tôi"}
        </button>
      </li>
      <li className='min-w-[150px]'>
        <button
          onClick={() => handleClick("/user/order")}
          className='rounded block w-full py-2.5 px-6 text-sm text-start font-semibold capitalize text-heading transition duration-200 hover:text-accent hover:bg-gray-100 focus:outline-none'            >
          {"Đơn hàng"}
        </button>
      </li>
      <li className='min-w-[150px]'>
        <button
          onClick={handleLogout}
          className='rounded block w-full py-2.5 px-6 text-sm text-start font-semibold capitalize text-heading transition duration-200 hover:text-accent hover:bg-gray-100 focus:outline-none'            >
          {"Đăng xuất"}
        </button>
      </li>
    </>
  )
 

  return (
    <div className='flex items-center'>
      <Popover content={content} trigger="hover" placement="bottomRight">
        <div>
          <Avatar
            className="bg-accent shadow-sm"
            src={user?.avatar||avatarPlaceholder}
            title="user name"
          />
        </div>
      
      </Popover>
    </div>
  );
}

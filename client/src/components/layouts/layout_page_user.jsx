import Avatar from '@components/ui/avatar'
import React from 'react'
import Header from './header'
import { default as avatarPlaceholder } from '@assets/placeholders/avatar.png';
import Link from 'next/link';
import { FaRegUser } from 'react-icons/fa'
import { MdOutlineEventNote, MdOutlineReviews } from 'react-icons/md'
import { GoLocation } from 'react-icons/go'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useProfileQuery as getProfileQuery } from '@data/profile/use-profile.query';

function GetLayoutPageUser({ children }) {
    const router = useRouter()
    const { data, isLoading: loading, error } = getProfileQuery();


    return (
        <div className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100">
            <Header />
            <div className='container mx-auto pt-5 pb-12 flex'>
                <div className='flex-shrink-0 w-[180px]'>
                    <div className='flex py-4 border-b'>
                        <div className=''>
                            <Avatar
                                className="bg-accent shadow-sm w-[50px] h-[50px]"
                                src={data?.user?.avatar||avatarPlaceholder}
                                title={data?.user?.name || "user name"}
                            />
                        </div>
                        <div className='pl-4 flex flex-col justify-content overflow-hidden' style={{flex: 1}}>
                            <div className='truncate text-[#333] font-semibold mb-1 text-sm'>{data?.user?.name}</div>
                            <div className='text-[#888] capitalize text-sm cursor-pointer'>
                                <Link href="/user/profile">Xem hồ sơ</Link>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[27px] cursor-pointer'>
                        <div className={`hover:text-accent capitalize ${router.pathname.startsWith('/user/profile') ? 'text-accent' : ''}`}>
                            <div className='mb-4'>
                                <Link className='flex' href="/user/profile">
                                    <FaRegUser className='text-lg mr-2.5'/> 
                                    <span className='text-sm font-semibold'>Tài khoản</span>
                                </Link>
                            </div>
                        </div>
                        <div className={`hover:text-accent capitalize ${router.pathname.startsWith('/user/order') ? 'text-accent' : ''}`}>
                            <div className='mb-4'>
                                <Link className='flex' href="/user/order">
                                    <MdOutlineEventNote className='text-lg mr-2.5'/> 
                                    <span className='text-sm font-semibold'>Đơn Mua</span>
                                </Link>
                            </div>
                        </div>
                        <div className={`hover:text-accent capitalize ${router.pathname.startsWith('/user/password') ? 'text-accent' : ''}`}>
                            <div className='mb-4'>
                                <Link className='flex' href="/user/password">
                                    <RiLockPasswordLine className='text-lg mr-2.5'/> 
                                    <span className='text-sm font-semibold'>Đổi mật khẩu</span>
                                </Link>
                            </div>
                        </div>
                       
                    </div>
                </div>
                <div className='flex-1 ml-[1.6875rem]'>
                    <div className='min-h-full px-[1.8755rem] pb-2.5'>
                        {children}
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default GetLayoutPageUser
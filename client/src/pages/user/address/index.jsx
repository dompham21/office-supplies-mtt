import AddressCard from '@components/address/address-card'
import AddressCheckout from '@components/address/address-checkout'
import ListAddressWithLoader from '@components/address/list-address-with-loader'
import GetLayoutPageUser from '@components/layouts/layout_page_user'
import Button from '@components/ui/button'
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlinePlus } from'react-icons/ai'
import { notification } from 'antd';
import { useProfileQuery } from '@data/profile/use-profile.query'
import { useAddressesQuery } from '@data/address/use-address.query'



export default function Address() {
    const { error, data: dataAddresses, isLoading: isLoadingAddresses } = useAddressesQuery();
    const [api, contextHolder] = notification.useNotification();


    const router = useRouter()
    const handleClickNewAddress = (e) => {
        e.preventDefault()
        router.push("/user/address/create")
    }

    return (
        <div className='flex flex-col bg-white rounded shadow-sm'>
            {contextHolder}
            <div className='px-[30px] py-6 flex items-center border-b'>
                <h1 className="text-lg font-semibold text-heading"  style={{flex : 1}}>
                Địa chỉ của tôi                
                </h1>
                <div>
                    <Button className='h-10' style={{height: '2.5rem'}} onClick={handleClickNewAddress}><AiOutlinePlus className='mr-1 text-xl font-semibold' />Them dia chi moi</Button>
                </div>
            </div>
            <div>
                <ListAddressWithLoader 
                isLoading={isLoadingAddresses}
                andresses={dataAddresses?.addresses} 
                isEmpty={!isLoadingAddresses && (dataAddresses?.addresses?.length == 0|| error)} >
                    {
                    dataAddresses?.addresses?.map(address => (
                        <AddressCard address={address} key={address.id}/>
                    ))
                    }      
                </ListAddressWithLoader>
            </div>
        </div>
    )
}

Address.authenticate = {
    permissions: ["USER"],
};

Address.Layout = GetLayoutPageUser
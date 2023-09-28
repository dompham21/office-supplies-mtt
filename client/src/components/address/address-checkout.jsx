import React from 'react'
import { Radio } from 'antd';

function AddressCheckout({address, value}) {
  return (
    <div className='flex py-4 border-t'>
        <div className='pr-1'>       
        <Radio value={value}/>
        </div>
        <div className='w-full'>
        <div className='flex justify-between mb-1 items-center'>
            <div className='flex flex-grow mr-2 items-center'>
            <span className='text-base text-[#000000de] font-bold'>{address?.name}</span>
            <div className='mx-2 border-l h-6'></div>
            <div className='text-sm text-[#0000008a]'>{address?.phone}</div>
            </div>
            {/* <div className='flex basis-20 justify-end'>
                <span className='text-base text-[#08f]'>Cap nhat</span>
            </div> */}
        </div>
        <div className='text-sm text-[#000000de] mt-2'>
            <div className='flex items-center'>{address?.specificAddress}</div>
            <div className='flex items-center'>{address?.ward.fullName}, {address?.ward?.district?.fullName}, {address?.ward?.district?.province?.fullName}</div>
        </div>
        {
            address?.default_address && (
                <div className='mt-1 flex items-center flex-wrap'>
                    <span className='text-sm text-accent border px-1 py-0.5 border-accent'>Mặc định</span>
                </div>
            )
        }
        
        </div>
    </div>
  )
}

export default AddressCheckout
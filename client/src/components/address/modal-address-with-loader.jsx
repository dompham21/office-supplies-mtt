import React from 'react'
import { Modal, Radio } from 'antd';
import AddressCheckout from './address-checkout';
import Button from '@components/ui/button';
import { AiOutlinePlus } from 'react-icons/ai';
import AddressLoader from '@components/ui/loaders/address-loader';
import rangeMap from '@utils/rangeMap';
import Image from 'next/image';
import { default as cartEmpty } from '@assets/cart-empty.png';

function ModalAddressWithLoader({addresses, isLoading, isEmpty, isModalOpen, handleCancelModal, handleOkModal, children}) {
  return (
    <Modal 
      className='modal-address p-0' okText="Xác nhận" 
      bodyStyle={{height: 500, overflow: 'hidden', overflowY: 'auto', scrollbarWidth: 'none'}} 
      title="Địa Chỉ Của Tôi" 
      open={isModalOpen} 
      onCancel={handleCancelModal} 
      onOk={handleOkModal}
      footer={[
        <Button key="submit" type="primary" onClick={handleOkModal}>
          Hoàn tất
        </Button>,
      ]}
    >    
       {isLoading ? (
          <>
            {rangeMap(10, (i) => (
              <AddressLoader className="mb-3" key={i} uniqueKey={`address-${i}`} />
            ))}
          </>
        ) :
            ( children )
        }
       {
        isEmpty && (
          <div className="w-full flex flex-col justify-center items-center py-16" >
            {/* <NotFound text="Chưa có đánh giá" className="w-7/12 mx-auto" /> */}
            <Image src={cartEmpty} width={100} height={100} alt={"cart empty"}/>
            <div className='mt-4 text-base text-trans-40 font-bold'>Địa chỉ của bạn trống</div>
          </div>
        )
       }

      
    </Modal>
  )
}

export default ModalAddressWithLoader
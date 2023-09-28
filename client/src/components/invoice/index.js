import { Button, Modal } from 'antd'
import React from 'react'
import PrintInvoice from './PrintInvoice';
import CreateOrUpdateInvoiceForm from './CreateOrUpdateInvoice';
import { useRouter } from 'next/router';
import { useInvoiceDetailAdminQuery } from '@data/invoice/admin/use-invoice-detail-admin.query';
import Loader from '@components/ui/loaders/loader';

  
function ModalInvoice({ open, setOpen, orderId}) {
    const { query } = useRouter();
    const {
        data,
        isLoading: loading,
        error,
    } = useInvoiceDetailAdminQuery(query.id);

    const handleCancel = () => {
        setOpen(false)
    }

    const handleOk = () => {
        setOpen(true)
    }
   
  return (
    <Modal 
        title="In hoá đơn" 
        open={open} 
        style={{ top: 20 }}
        onOk={handleOk} 
        onCancel={handleCancel}
        width={1014}
        footer={null}
    >
        {
            loading ? <Loader text={"Đang tải"} /> :
            !data?.invoice ? 
            <CreateOrUpdateInvoiceForm/>
            : <PrintInvoice invoice={data?.invoice}/>
        }
    </Modal>
  )
}

export default ModalInvoice
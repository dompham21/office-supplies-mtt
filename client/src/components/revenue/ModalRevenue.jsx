import { Button, Modal } from 'antd'
import React from 'react'
import { useRouter } from 'next/router';
import Loader from '@components/ui/loaders/loader';
import PrintRevenue from './PrintRevenue';
import { useRevenueBetweenQuery } from '@data/dashboard/use-revenue-between.query';

  
function ModalRevenue({ open, setOpen, fromDate, toDate}) {
    const {data, isLoading: loading, error} = useRevenueBetweenQuery({fromDate: fromDate, toDate: toDate})

    const handleCancel = () => {
        setOpen(false)
    }

    const handleOk = () => {
        setOpen(true)
    }
   
  return (
    <Modal 
        title="In báo cáo" 
        open={open} 
        style={{ top: 20 }}
        onOk={handleOk} 
        onCancel={handleCancel}
        width={1014}
        footer={null}
    >
        {
            loading ? <Loader text={"Đang tải"} /> :
            data?.data ? <PrintRevenue revenue={data?.data} fromDate={fromDate} toDate={toDate}/> : null
        }
    </Modal>
  )
}

export default ModalRevenue
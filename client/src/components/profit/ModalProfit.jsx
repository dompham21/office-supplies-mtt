import { Button, Modal } from 'antd'
import React from 'react'
import { useRouter } from 'next/router';
import Loader from '@components/ui/loaders/loader';
import PrintRevenue from './PrintProfit';
import PrintProfit from './PrintProfit';
import { useProfitBetweenQuery } from '@data/dashboard/use-profit-between.query';

  
function ModalProfit({ open, setOpen, fromDate, toDate}) {
    const {data, isLoading: loading, error} = useProfitBetweenQuery({fromDate: fromDate, toDate: toDate})

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
            data?.data ? <PrintProfit revenue={data?.data} fromDate={fromDate} toDate={toDate}/> : null
        }
    </Modal>
  )
}

export default ModalProfit
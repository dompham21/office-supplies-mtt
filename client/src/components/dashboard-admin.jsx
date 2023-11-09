import { useAnalyticsQuery } from '@data/dashboard/use-analytics.query'
import { currencyMoney } from '@utils/format-currency'
import React from 'react'
import CartIcons from './icons/cart-icons'
import CoinIcons from './icons/coin-icons'
import DollarIcons from './icons/dollar-icons'
import ShopIcons from './icons/shop-icons'
import SaleHistory from './widget/sale-history-chart'
import OrderStatusChart from './widget/order-status-chart'
import ReviewChart from './widget/review-chart'
import SoldCategoryChart from './widget/sold-category-chart'
import StickerCard from './widget/sticker-card'
import UserActivityChart from './widget/user-activity-chart'
import RevenueChart from './widget/revenue-chart'
import OrderCancelChart from './widget/order-cancel-chart'
import ProfitChart from './widget/profit-chart'

function AdminDashboard() {

  const {
      data,
      isLoading: loading,
      error,
  } = useAnalyticsQuery();

 
  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className="w-full ">
          <StickerCard
            titleTransKey="Tổng doanh thu"
            subtitleTransKey="(30 ngày gần nhất)"
            icon={<DollarIcons className="w-7 h-7" color="#047857" />}
            iconBgStyle={{ backgroundColor: "#A7F3D0" }}
            price={currencyMoney(data?.total_revenue) || '0'}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="Tổng đơn hàng"
            subtitleTransKey="(30 ngày gần nhất)"
            icon={<CartIcons />}
            price={data?.total_order}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="Khách hàng mới"
            subtitleTransKey="(30 ngày gần nhất)"
            icon={<CoinIcons />}
            price={data?.total_review}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="Đánh giá mới"
            subtitleTransKey="(30 ngày gần nhất)"
            icon={<ShopIcons className="w-6" color="#1D4ED8" />}
            iconBgStyle={{ backgroundColor: "#93C5FD" }}
            price={data?.total_review}
          />
        </div>
      </div>
      <div className='w-full flex flex-col  flex-wrap mb-6'>
        <RevenueChart/>
      </div>
      <div className='w-full flex flex-col  flex-wrap mb-6'>
        <ProfitChart/>
      </div>
      <div className="w-full flex flex-col flex-wrap mb-6">
        <SaleHistory/>
      </div>
      <div className="w-full flex flex-wrap mb-6">
        <div className="w-full sm:w-1/2 xl:w-1/2 sm:px-3 sm:pl-0 mb-6 xl:mb-0">
          <OrderStatusChart/>
        </div>
        <div className="w-full sm:w-1/2 xl:w-1/2 sm:px-3 sm:pl-0 mb-6 xl:mb-0">
          <OrderCancelChart/>
        </div>
      </div>
      <div className="w-full flex flex-wrap mb-6">
        <div className="w-full sm:w-1/2 xl:w-1/2 sm:px-3 sm:pl-0 mb-6 xl:mb-0">
          <SoldCategoryChart/>
        </div>
       
      </div>
    </>
  )
}

export default AdminDashboard
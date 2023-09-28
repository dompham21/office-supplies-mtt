import Chart from '@components/ui/chart';
import { useOrderOverview } from '@data/dashboard/use-order-overview.query';
import React, { useState } from 'react'
import { Radio, Spin } from 'antd';


function OrderStatusChart({
    widgetTitle,
    series,
    colors,
    prefix,
    totalValue,
    text,
    position,
    percentage,
    categories,
  }) {
    const [type, setType] = useState(2);
    const {
      data,
      isLoading: loading,
      error,
    } = useOrderOverview({type: type});

    const handleChangeType = (e) => {
      setType(e.target.value)
    }

    const options = {
        series: data?.data,
        options: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: data?.label,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }],
          noData: {
            text: 'Loading...'
          }
        },
    };

    return (
      <div className="bg-light shadow-sm rounded w-full h-full">
          <div className="p-8 flex items-center justify-between">
              <h3 className="text-sm font-bold text-heading">Thống kê đơn hàng</h3>
              <Radio.Group defaultValue="2" buttonStyle="solid" onChange={handleChangeType}>
                  <Radio.Button value="0">Year</Radio.Button>
                  <Radio.Button value="1">Month</Radio.Button>
                  <Radio.Button value="2">Week</Radio.Button>
                </Radio.Group>
          </div>
          {
            data?.data ?
            <div className="flex flex-wrap w-full" style={{ display: "block" }}>
              <Chart
                  options={options.options}
                  series={options.series}
                  height="350"
                  width="100%"
                  type="pie"
              />
            </div>
            :
            <div className='w-full h-[350px] flex items-center justify-center'>
              <Spin/> 
            </div> 
          }

          
      </div>
    )
}

export default OrderStatusChart
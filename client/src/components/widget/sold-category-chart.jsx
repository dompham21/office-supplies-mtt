import Chart from '@components/ui/chart';
import { useSoldByCategoryQuery } from '@data/dashboard/use-sold-by-category.query';
import { Spin } from 'antd';
import React from 'react'


function SoldCategoryChart({
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

    const {
      data,
      isLoading: loading,
      error,
    } = useSoldByCategoryQuery();

    const options = {
        series: [{
          name: 'Sold',
          data: data?.data
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: data?.label
          },
          noData: {
            text: 'Loading...'
          }
        },
    };

    return (
        <div className="bg-light shadow-sm rounded w-full h-full">
            <div className="p-8 flex items-center justify-between">
                <h3 className="text-sm font-bold text-heading">Bán theo danh mục</h3>
            </div>

            {
              data?.data ?  
              <div className="flex flex-wrap w-full" style={{ display: "block" }}>
                <Chart
                    options={options.options}
                    series={options.series}
                    height="350"
                    width="100%"
                    type="bar"
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

export default SoldCategoryChart
import Chart from '@components/ui/chart'
import { useReviewOverview } from '@data/dashboard/use-review-overview.query';
import { Radio, Spin } from 'antd';
import React, { useState } from 'react'

function ReviewChart() {
  const [type, setType] = useState(2);
  const {
    data,
    isLoading: loading,
    error,
  } = useReviewOverview({type: type});

    const options = {
      series: [{
          name: 'Review',
          data: data?.data
      }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories:data?.label,
          },
          yaxis: {
            title: {
              text: 'Review'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return  val 
              }
            }
          },
          noData: {
            text: 'Loading...'
          }
        },
    };

    const handleChangeType = (e) => {
      setType(e.target.value)
    }

  return (
    <div className="bg-light shadow-sm rounded w-full h-full">
        <div className="p-8 flex items-center justify-between">
            <h3 className="text-sm font-bold text-heading">Reviews Overview</h3>
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

export default ReviewChart
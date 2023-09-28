import Chart from '@components/ui/chart';
import { useUserOverview } from '@data/dashboard/use-user-overview.query';
import { Radio } from 'antd';
import React, { useState } from 'react'
import { Spin } from 'antd';

function UserActivityChart() {
    const [type, setType] = useState(2);
    const {
      data,
      isLoading: loading,
      error,
    } = useUserOverview({type: type});

    const options = {
        series: [{
            name: 'User activity',
            data: data?.data
        }],
        options: {
            chart: {
              type: 'area',
              stacked: false,
              height: 350,
              zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
              },
              toolbar: {
                autoSelected: 'zoom'
              }
            },
            dataLabels: {
              enabled: false
            },
            markers: {
              size: 0,
            },
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
              },
            },
            yaxis: {
  
              title: {
                text: 'User'
              },
            },
            xaxis: {
                categories: data?.label,
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
    
    }
    const handleChangeType = (e) => {
      setType(e.target.value)
    }

    return (
        <div className="bg-light shadow-sm rounded w-full h-full">
            <div className="p-8 flex items-center justify-between">
                <h3 className="text-sm font-bold text-heading">User Overview</h3>
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
                    type="area"
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

export default UserActivityChart
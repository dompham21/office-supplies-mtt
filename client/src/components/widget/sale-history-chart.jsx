import Chart from '@components/ui/chart';
import React, { useState } from 'react'
import cn from "classnames";
import ArrowUpIcons from '@components/icons/arrow-up-icons';
import ArrowDownIcons from '@components/icons/arrow-down-icons';
import { useSaleHistoryQuery } from '@data/dashboard/use-sale-history.query';
import MoreIcons from '@components/icons/more-icons';
import { Button, Radio, Spin, Modal, DatePicker } from 'antd';
import { currencyMoney } from '@utils/format-currency';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDatePicker } from '@utils/format-date-picker';
import customLocale from 'dayjs/locale/vi'
import locale from '@utils/locale-datepicker';
import { useRevenueBetweenQuery } from '@data/dashboard/use-revenue-between.query';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RevenuePdfFile from '@components/revenue/PrintRevenue';



const { RangePicker } = DatePicker;
function SaleHistory() {
    const [type, setType] = useState(2);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromDateSubmit, setFromDateSubmit] = useState(null);
    const [toDateSubmit, setToDateSubmit] = useState(null);

    const {
      data,
      isLoading: loading,
      error,
    } = useSaleHistoryQuery({type: type});

    const {data: dataRevenueBetween, isLoading: loadingEwvenueBetween} = useRevenueBetweenQuery({fromDate: fromDate, toDate:toDate})
    
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const options = {
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: "65%",
              endingShape: "flat",
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: false,
            width: 2,
          },
          grid: {
            borderColor: "#F7F7F7",
            xaxis: {
              lines: {
                show: false,
              },
            },
          },
          colors: "#03D3B5",
          xaxis: {
            labels: {
              show: true,
              style: {
                colors: "#161F6A",
                fontSize: "14px",
                fontFamily: "'Lato', sans-serif",
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            categories: data?.label,
          },
          yaxis: {
            show: true,
            labels: {
              show: true,
              style: {
                color: "#161F6A",
                fontSize: "14px",
                fontFamily: "'Lato', sans-serif",
              },
            
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return  currencyMoney(val) 
              }
            }
          },
          noData: {
            text: 'Loading...'
          }
        },
        series: [
          {
            name: "Sale",
            data: data?.data,
          },
        ],
    };

    const handleChangeType = (e) => {
      setType(e.target.value)
    }
    
    const disabledDate = (current) => {
      return current && current > dayjs().endOf('day');
    };

    const handleOnChange = (date, dateString) => {
      const filteredDates = dateString.filter(date => date !== null || date !== '');
      if (filteredDates.length >= 2) {
          setFromDate(dateString[0])
          setToDate(dateString[1])
      }
   }

    return (
        <div className="bg-light shadow-sm rounded w-full h-full">
            <div className="p-8 flex items-center justify-between">
                <h3 className="text-sm text-heading font-bold">{"Doanh thu"}</h3>
                <div className='flex items-center gap-4'>
                  <Radio.Group defaultValue="2" buttonStyle="solid" onChange={handleChangeType}>
                    <Radio.Button value="0">Year</Radio.Button>
                    <Radio.Button value="1">Month</Radio.Button>
                    <Radio.Button value="2">Week</Radio.Button>
                  </Radio.Group>
                </div>
                
               
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

export default SaleHistory
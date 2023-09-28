import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import React from 'react'

function OrderStatusSelectInput({ control, error, current_status }) {
    const renderSelectInputOrderStatus = (order_status) => {
        switch(order_status){
            case 1: { // cho xu ly hoac cho lay hang
                
                return [
                    {
                        id: 2,
                        name: "Wating for grab"
                    },
                    {
                        id: 5,
                        name: "Canceled"
                    }
                ]
            }
            case 2: {
                return [
                    {
                        id: 3,
                        name: "Delivering"
                    },
                    {
                        id: 5,
                        name: "Canceled"
                    }
                ]
            }
            case 3: {
                return [
                    {
                        id: 4,
                        name: "Delivered"
                    },
                    {
                        id: 5,
                        name: "Canceled"
                    }
                ]
            }
            case 4: {
                return [
                ]
            }
            case 5: {
                return [
    
                ]
            }
            case 6: {
                return [
                    {
                        id: 1,
                        name: "Order Processing"
                    },
                    {
                        id: 2,
                        name: "Wating for grab"
                    },
                    {
                        id: 5,
                        name: "Canceled"
                    }
                ]
            }
            default: return []
        }
    }

    
    return (
        <>
            <SelectInput
                id="order_status"
                name="order_status"
                control={control}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                options={renderSelectInputOrderStatus(current_status)}
                placeholder={"Order status"}
                rules={{
                  required: "Status is required",
                }}
            />
            <ValidationError message={error} />
        </>
    )
}

export default OrderStatusSelectInput
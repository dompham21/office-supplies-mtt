import React, { useState } from "react";
import cn from "classnames";
import Select from "@components/ui/select/select";



export default function OrderStatusFilter({
  onStatusFilter,
  status,
  className,
}) {
    const [val, setVal] = useState(null)

    const options = [
        {
            id: 1,
            name: "Order Processing"
        },
        {
            id: 2,
            name: "Wating for grab"
        },
        {
            id: 3,
            name: "Delivering"
        },
        {
            id: 4,
            name: "Delivered"
        },
        {
            id: 5,
            name: "Canceled"
        },
        {
            id: 6,
            name: "Request Cancel"
        },

    ]

    const handleOnChangeStatusFilter = (e) => {
        onStatusFilter(e);
    }

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:space-x-5 md:items-end space-y-5 md:space-y-0 w-full",
        className
      )}
    >
      <div className="w-full">
        <label className="block text-body-dark font-semibold text-sm leading-none mb-3">{"Filter by status"}</label>
        <Select
          options={options}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder={"Order status"}
          onChange={handleOnChangeStatusFilter}
          value={status}
        />
      </div>
    </div>
  );
}

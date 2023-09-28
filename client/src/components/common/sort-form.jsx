import cn from "classnames";
import Select from "@components/ui/select/select";
import CloseIcons from "@components/icons/close-icons";
// import { useTranslation } from "next-i18next";
import { TbFilterOff } from "react-icons/tb"
import { useState } from "react";

const SortForm = ({
  onSortFieldChange,
  onSortDirectionChange,
  options,
  className,
  onClear,
  showLabel = true,
}) => {
    const [sortFieldVal, setSortFieldVal] = useState(null)
    const [sortDirVal, setSortDirVal] = useState({ id: 2, value: "desc", label: "DESC" })

    const handleClear = () => {
        onClear();
        setSortDirVal({ id: 2, value: "desc", label: "DESC" })
        setSortFieldVal(null)
    }

    const handleOnChangeSortField = (e) => {
        setSortFieldVal(e)
        onSortFieldChange(e);
    }

    const handleOnChangeSortDir = (e) => {
        setSortDirVal(e)
        onSortDirectionChange(e);
    }

    return (
        <div className={cn("flex items-end w-full", className)}>
        <div className="w-[300px]">
            {showLabel && <label className="block text-body-dark font-semibold text-sm leading-none mb-3">{"Order By"}</label>}
            <Select
            value={sortFieldVal}
            options={options}
            onChange={handleOnChangeSortField}
            name="sortField"
            placeholder={"Order By"}
            />
        </div>

        <div className="w-[200px] ms-5">
            <Select
            options={[
                { id: 1, value: "asc", label: "ASC" },
                { id: 2, value: "desc", label: "DESC" },
            ]}
            onChange={handleOnChangeSortDir}
            value={sortDirVal}
            name="sortDirection"
            />
        </div>
        <div className="flex items-center h-[50px] ml-4 cursor-pointer text-accent text-xl font-bold" onClick={handleClear}>
            <TbFilterOff/>
        </div>
        </div>
    );
};

export default SortForm;

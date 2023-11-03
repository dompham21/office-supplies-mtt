import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import { useBrandsQuery } from '@data/brand/use-brands.query';
import { useSuppliersQuery } from '@data/supplier/use-suppliers.query';
import React from 'react'

function SupplierSelectInput({ control, error }) {
    const { data, isLoading: loading } = useSuppliersQuery();
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Nhà cung cấp*</label>
            <SelectInput
                id="supplier"
                name="supplier"
                control={control}
                placeholder={"Chọn nhà cung cấp"}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                options={data?.suppliers}
                isLoading={loading}
            />
            <ValidationError message={error} />
        </div>
    )
}

export default SupplierSelectInput
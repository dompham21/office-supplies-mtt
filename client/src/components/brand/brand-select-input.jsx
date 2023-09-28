import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import { useBrandsQuery } from '@data/brand/use-brands.query';
import React from 'react'

function BrandSelectInput({ control, error }) {
    const { data, isLoading: loading } = useBrandsQuery();
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Thương hiệu*</label>
            <SelectInput
                id="brand"
                name="brand"
                control={control}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                options={data?.brands}
                isLoading={loading}
            />
            <ValidationError message={error} />
        </div>
    )
}

export default BrandSelectInput
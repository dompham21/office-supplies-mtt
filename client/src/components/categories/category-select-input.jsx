import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import { useCategoriesQuery } from '@data/category/use-category.query'
import React from 'react'

function CategorySelectInput({ control, error }) {
    const { data, isLoading: loading } = useCategoriesQuery();
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Danh mục*</label>
            <SelectInput
            id="category"
            name="category"
            control={control}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            options={data?.categories}
            isLoading={loading}
            />
            <ValidationError message={error} />
        </div>
    )
}

export default CategorySelectInput
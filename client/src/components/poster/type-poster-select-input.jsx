import ValidationError from '@components/ui/form-validation-error'
import SelectAntd from '@components/ui/select-antd'
import SelectInput from '@components/ui/select-input'
import { useCategoriesQuery } from '@data/category/use-category.query'
import React from 'react'

function TypeSelectInput({ control, error }) {
    const options = [
        { id: 0, name: 'Left' },
        { id: 1, name: 'Right' },
      ]
   
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Type*</label>
            <SelectAntd
                id="type"
                name="type"
                control={control}
                options={options}
                className='w-full'
            />
            <ValidationError message={error} />
        </div>
    )
}

export default TypeSelectInput
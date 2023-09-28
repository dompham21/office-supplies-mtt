import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import { useRolesQuery } from '@data/role/use-role.query';
import React from 'react'

function RoleSelectInput({ control, error }) {
    const { data, isLoading: loading } = useRolesQuery();
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Roles*</label>
            <SelectInput
            id="roles"
            name="roles"
            control={control}
            isMulti={true}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            options={data?.roles}
            isLoading={loading}
            />
            <ValidationError message={error} />
        </div>
    )
}

export default RoleSelectInput
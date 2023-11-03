import ValidationError from '@components/ui/form-validation-error'
import SelectInput from '@components/ui/select-input'
import { useBrandsQuery } from '@data/brand/use-brands.query';
import { usePurchaseOrdersActiveQuery } from '@data/purchase/admin/use-purchase-orders-active-admin.query';
import { useSuppliersQuery } from '@data/supplier/use-suppliers.query';
import React from 'react'

function PurchaseOrderSelectInput({ control, error }) {
    const {
        data,
        isLoading: loading,
      } = usePurchaseOrdersActiveQuery();
    return (
        <div className="mb-5">
            <label className="block text-body-dark font-semibold text-sm leading-none mb-3">Phiếu đặt*</label>
            <SelectInput
                id="purchaseOrder"
                name="purchaseOrder"
                control={control}
                placeholder={"Chọn phiếu đặt"}
                getOptionLabel={(option) => option.id}
                getOptionValue={(option) => option.id}
                options={data?.purchaseOrders}
                isLoading={loading}
            />
            <ValidationError message={error} />
        </div>
    )
}

export default PurchaseOrderSelectInput
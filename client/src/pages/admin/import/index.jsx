import CreateOrUpdateImportForm from '@components/import/create-or-update-import-form';
import AdminLayout from '@components/layouts/admin-layout';
import { Button, DatePicker, Input, Table } from 'antd';
import dayjs from 'dayjs';
import React, { Fragment, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form';

export default function CreateImportPage() {
  return (
    <Fragment>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create import"}
        </h1>
      </div>
      <CreateOrUpdateImportForm />
    </Fragment>
  )
}

CreateImportPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateImportPage.Layout = AdminLayout;

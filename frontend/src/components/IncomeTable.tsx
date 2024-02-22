import { IncomeFormValues } from '@/routes/income';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Table } from './Table';
import useSWR from 'swr';

type Income = {
  id: number;
} & IncomeFormValues;

const columnHelper = createColumnHelper<Income[]>();

export const IncomeTable = () => {
  const { data, isLoading } = useSWR('/Incomes');

  const colums = useMemo(
    () => [
      columnHelper.accessor('Type', {
        id: 'type',
        header: () => 'Type',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('OneTime', {
        id: 'oneTime',
        header: () => 'One time',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('Frequency', {
        id: 'frequency',
        header: () => 'Frequency',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('Value', {
        id: 'amount',
        header: () => 'Amount',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('Start', {
        id: 'startDate',
        header: () => 'From',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('End', {
        id: 'endDate',
        header: () => 'To',
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [],
  );

  if (isLoading) {
    return null;
  }

  return <Table data={data} columns={colums} />;
};

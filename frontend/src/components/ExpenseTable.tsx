import { Column, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Table } from './Table';
import { Expense } from '@/routes/expenses';
import { EXPENSE_TYPE_OPTIONS, FREQUENCY_OPTIONS } from '@/constants';

const columnHelper = createColumnHelper<Expense>();

type ExpenseTableProps = {
  data: Expense[];
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ data }) => {
  const colums = useMemo(
    () =>
      [
        columnHelper.accessor('Type', {
          id: 'type',
          header: () => 'Type',
          cell: ({ getValue }) => EXPENSE_TYPE_OPTIONS.find(({ id }) => id === getValue())?.name,
        }),
        columnHelper.accessor('Frequency', {
          id: 'frequency',
          header: () => 'Frequency',
          cell: ({ getValue, row }) => {
            const { OneTime } = row.original;
            if (OneTime === 0) {
              return 'One time';
            } else {
              return FREQUENCY_OPTIONS.find(({ id }) => id === getValue())?.name;
            }
          },
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
      ] as Column<Expense>[],
    [],
  );

  return <Table data={data} columns={colums} />;
};

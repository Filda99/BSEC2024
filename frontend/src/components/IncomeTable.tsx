import { FREQUENCY_OPTIONS, Income, TYPE_OPTIONS } from '@/routes/income';
import { Column, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Table } from './Table';

const columnHelper = createColumnHelper<Income>();

type IncomeTableProps = {
  data: Income[];
};

export const IncomeTable: React.FC<IncomeTableProps> = ({ data }) => {
  const colums = useMemo(
    () =>
      [
        columnHelper.accessor('Type', {
          id: 'type',
          header: () => 'Type',
          cell: ({ getValue }) => TYPE_OPTIONS.find(({ id }) => id === getValue())?.name,
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
      ] as Column<Income>[],
    [],
  );

  return <Table data={data} columns={colums} />;
};

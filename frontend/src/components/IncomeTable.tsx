import { Income } from '@/routes/income';
import { Column, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Table } from './Table';
import { FREQUENCY_OPTIONS, INCOME_TYPE_OPTIONS } from '@/constants';
import { format } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Income>();

type IncomeTableProps = {
  data: Income[];
  onDelete: (id: string) => void;
};

export const IncomeTable: React.FC<IncomeTableProps> = ({ data, onDelete }) => {
  const colums = useMemo(
    () =>
      [
        columnHelper.accessor('Type', {
          id: 'type',
          header: () => 'Type',
          cell: ({ getValue }) => INCOME_TYPE_OPTIONS.find(({ id }) => id === getValue())?.name,
        }),
        columnHelper.accessor('Frequency', {
          id: 'frequency',
          header: () => 'Frequency',
          cell: ({ getValue, row }) => {
            const { OneTime } = row.original;
            if (OneTime) {
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
          cell: ({ getValue }) => format(getValue(), 'd. M. yyyy'),
        }),
        columnHelper.accessor('End', {
          id: 'endDate',
          header: () => 'To',
          cell: ({ getValue, row }) => {
            const { OneTime } = row.original;
            if (OneTime) {
              return undefined;
            } else {
              return format(getValue(), 'd. M. yyyy');
            }
          },
        }),
        columnHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            return (
              <div className="flex-col items-center justify-center">
                <button className="p-1 rounded-full hover:bg-gray-50" onClick={() => onDelete(row.original._id)}>
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            );
          },
        }),
      ] as Column<Income>[],
    [onDelete],
  );

  return <Table data={data} columns={colums} />;
};

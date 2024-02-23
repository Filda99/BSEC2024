import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type TableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
};

export const Table = <TData,>({ data, columns }: TableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getRowModel, getHeaderGroups } = table;

  const showEmptyMessage = getRowModel().rows.length === 0;

  return (
    <div className="flex-1">
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100 font-semibold leading-4 text-gray-500 ">
          {getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const headerContent = flexRender(header.column.columnDef.header, header.getContext());

                return (
                  <th key={header.id} colSpan={header.colSpan} className="'border p-2">
                    {headerContent}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="whitespace-nowrap bg-white text-center">
          {showEmptyMessage && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6">
                No data.
              </td>
            </tr>
          )}
          {getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="hover:bg-gray-200">
                {row.getVisibleCells().map(cell => {
                  const cellContext = cell.getContext();

                  /* !! původní typ je (string | ((props: TProps) => any)) !! */
                  const cellContent = (cell.column.columnDef.cell as (props: unknown) => unknown)(cellContext);

                  const isNonActionCell = cell.column.accessorFn !== undefined;

                  const isEmptyNonActionCell = !cellContent && isNonActionCell;

                  return (
                    <td
                      {...(typeof cellContent === 'string' && { title: cellContent })}
                      className="truncate border-x px-1 py-1"
                      key={cell.id}
                    >
                      {isEmptyNonActionCell ? '—' : flexRender(cell.column.columnDef.cell, cellContext)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

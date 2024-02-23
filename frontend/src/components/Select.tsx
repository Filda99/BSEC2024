import { cn } from '@/lib/utils';
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export type SelectItem = {
  id: number | string;
  name: string;
};

type SelectProps = {
  options: SelectItem[];
  onChange: (value: number | string) => void;
  selected: number | string;
};

export const Select: React.FC<SelectProps> = ({ options, onChange, selected }) => {
  const selectedOption = options.find(option => option.id === selected)!;

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="flex w-full items-center justify-between space-x-1.5 rounded-md border px-2 py-1 focus-visible:border-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-1">
          {selectedOption.name}
          <span className="shrink-0 text-secondary-400">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white py-1 shadow-md focus-visible:outline-none">
          {options.map(({ id, name }) => (
            <Listbox.Option
              key={id}
              value={id}
              className={({ active, selected }) =>
                cn(
                  {
                    'font-semibold': selected,
                  },
                  active ? 'border-gray-950 bg-gray-100' : 'border-white',
                  'flex items-center justify-between space-x-1.5 border-l-2 px-1.5 py-1 focus-visible:outline-none',
                )
              }
            >
              {name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

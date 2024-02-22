import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Button } from './Button';

type DatePickerProps = {
  value: Date;
  onChange: (date: Date | undefined) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({ onChange, value }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button Icon={CalendarDaysIcon} variant="form">
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

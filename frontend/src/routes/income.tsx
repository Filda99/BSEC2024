// import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { Input } from '@/components/Input';
import { InputGroup } from '@/components/InputGroup';
import { Select, SelectItem } from '@/components/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';

const options: SelectItem[] = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
];

const ONE_TIME_OPTIONS: SelectItem[] = [
  { id: 1, name: 'Periodicaly' },
  { id: 0, name: 'One time' },
];

type FormValues = {
  type: number;
  oneTime: number;
  frequency: number;
  amount: number;
  startDate: Date;
  endDate: Date;
};

const Income = () => {
  const { register, control, watch } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      type: 1,
      oneTime: 0,
      frequency: 1,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const isOneTimeIncome = watch('oneTime');

  return (
    <form className="space-y-4 mt-5 max-w-72">
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="Type">
            <Select onChange={onChange} options={options} selected={value} />
          </InputGroup>
        )}
      />

      <Controller
        control={control}
        name="oneTime"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="One time">
            <Select onChange={onChange} options={ONE_TIME_OPTIONS} selected={value} />
          </InputGroup>
        )}
      />

      {isOneTimeIncome === 1 && (
        <Controller
          control={control}
          name="frequency"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Frequency">
              <Select onChange={onChange} options={options} selected={value} />
            </InputGroup>
          )}
        />
      )}

      <Controller
        control={control}
        name="startDate"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="From">
            <DatePicker onChange={onChange} value={value} />
          </InputGroup>
        )}
      />
      <Controller
        control={control}
        name="endDate"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="To">
            <DatePicker onChange={onChange} value={value} />
          </InputGroup>
        )}
      />

      <InputGroup label="Amount">
        <Input {...register('amount')} />
      </InputGroup>

      <Button type="submit">Sumbit</Button>
    </form>
  );
};

export const Route = createFileRoute('/income')({
  component: Income,
});

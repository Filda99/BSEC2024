// import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { Input } from '@/components/Input';
import { InputGroup } from '@/components/InputGroup';
import { Select, SelectItem } from '@/components/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { getIncomes, createIncome, updateIncome, deleteIncome } from '@/api/api';

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
  Type: number;
  OneTime: number;
  Frequency: number;
  Value: number;
  Start: Date;
  End: Date;
};

const Income = () => {
  const { register, control, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      Value: 0,
      Type: 1,
      OneTime: 0,
      Frequency: 1,
      Start: new Date(),
      End: new Date(),
    },
  });

  const isOneTimeIncome = watch('OneTime');

  const onSubmit = (data: FormValues) => {
    createIncome(data);
  };

  return (
    <form className="space-y-4 mt-5 max-w-72" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="Type"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="Type">
            <Select onChange={onChange} options={options} selected={value} />
          </InputGroup>
        )}
      />

      <Controller
        control={control}
        name="OneTime"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="One time">
            <Select onChange={onChange} options={ONE_TIME_OPTIONS} selected={value} />
          </InputGroup>
        )}
      />

      {isOneTimeIncome === 1 && (
        <Controller
          control={control}
          name="Frequency"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Frequency">
              <Select onChange={onChange} options={options} selected={value} />
            </InputGroup>
          )}
        />
      )}

      <Controller
        control={control}
        name="Start"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="From">
            <DatePicker onChange={onChange} value={value} />
          </InputGroup>
        )}
      />
      <Controller
        control={control}
        name="End"
        render={({ field: { value, onChange } }) => (
          <InputGroup label="To">
            <DatePicker onChange={onChange} value={value} />
          </InputGroup>
        )}
      />

      <InputGroup label="Amount">
        <Input {...register('Value')} />
      </InputGroup>

      <Button type="submit">Sumbit</Button>
    </form>
  );
};

export const Route = createFileRoute('/income')({
  component: Income,
});

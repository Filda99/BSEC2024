import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { IncomeTable } from '@/components/IncomeTable';
import { Input } from '@/components/Input';
import { InputGroup } from '@/components/InputGroup';
import { Select, SelectItem } from '@/components/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { createIncome } from '@/api/api';
import useSWR from 'swr';

export const TYPE_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Salary' },
  { id: 1, name: 'Gift' },
  { id: 2, name: 'Ohter' },
];

export const FREQUENCY_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Daily' },
  { id: 1, name: 'Weekly' },
  { id: 2, name: 'Monthly' },
  { id: 3, name: 'Yearly' },
];

export const ONE_TIME_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Periodicaly' },
  { id: 1, name: 'One time' },
];

export type IncomeFormValues = {
  Type: number;
  OneTime: number;
  Frequency: number;
  Value: number;
  Start: Date;
  End: Date;
};

export type Income = {
  id: number;
} & IncomeFormValues;

const Income = () => {
  const { data, isLoading, mutate } = useSWR('/Incomes');
  console.log(data);

  const { register, control, watch, handleSubmit } = useForm<IncomeFormValues>({
    defaultValues: {
      Value: 0,
      Type: 1,
      OneTime: 0,
      Frequency: 1,
      Start: new Date(),
      End: new Date(),
    },
  });

  const isPeriodicIncome = watch('OneTime') === 0;

  const onSubmit = async (data: IncomeFormValues) => {
    const response = await createIncome(data);
    if (response.status === 200) {
      mutate();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4 mt-5 max-w-72" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="Type"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Type">
              <Select onChange={onChange} options={TYPE_OPTIONS} selected={value} />
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

        <Controller
          control={control}
          name="Start"
          render={({ field: { value, onChange } }) => (
            <InputGroup label={isPeriodicIncome ? 'From' : 'Date of income'}>
              <DatePicker onChange={onChange} value={value} />
            </InputGroup>
          )}
        />

        {isPeriodicIncome && (
          <Controller
            control={control}
            name="End"
            render={({ field: { value, onChange } }) => (
              <InputGroup label="To">
                <DatePicker onChange={onChange} value={value} />
              </InputGroup>
            )}
          />
        )}

        {isPeriodicIncome && (
          <Controller
            control={control}
            name="Frequency"
            render={({ field: { value, onChange } }) => (
              <InputGroup label="Frequency">
                <Select onChange={onChange} options={FREQUENCY_OPTIONS} selected={value} />
              </InputGroup>
            )}
          />
        )}

        <InputGroup label="Amount">
          <Input {...register('Value')} />
        </InputGroup>
        <Button type="submit">Sumbit</Button>
      </form>
      <IncomeTable data={data} />
    </div>
  );
};

export const Route = createFileRoute('/income')({
  component: Income,
});

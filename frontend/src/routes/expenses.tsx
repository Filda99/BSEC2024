import { DatePicker } from '@/components/DatePicker';
import { InputGroup } from '@/components/InputGroup';
import { Select } from '@/components/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import useSWR from 'swr';
import { createExpenses } from '@/api/api';
import { ExpenseTable } from '@/components/ExpenseTable';
import { FREQUENCY_OPTIONS, ONE_TIME_OPTIONS, EXPENSE_TYPE_OPTIONS } from '@/constants';
import { Button } from '@/components/Button';

type ExpenseFormValues = {
  Type: number;
  OneTime: number;
  Start: Date;
  End: Date;
  Frequency: number;
  Value: number;
};

export type Expense = {
  id: string;
} & ExpenseFormValues;

const Expenses = () => {
  const { data, isLoading, mutate } = useSWR('/Expenses');

  const { register, control, watch, handleSubmit } = useForm<ExpenseFormValues>({
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

  const onSubmit = async (data: ExpenseFormValues) => {
    const response = await createExpenses(data);
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
              <Select onChange={onChange} options={EXPENSE_TYPE_OPTIONS} selected={value} />
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
      <ExpenseTable data={data} />
    </div>
  );
};

export const Route = createFileRoute('/expenses')({
  component: Expenses,
});

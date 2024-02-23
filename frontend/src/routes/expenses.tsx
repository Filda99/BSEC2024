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
import { deleteExpense } from '@/api/api';
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
  _id: string;
} & ExpenseFormValues;

const Expenses = () => {
  const { data, isLoading, mutate } = useSWR('/Expenses');

  const { register, control, watch, handleSubmit } = useForm<ExpenseFormValues>({
    defaultValues: {
      Value: 100,
      Type: 0,
      OneTime: 0,
      Frequency: 0,
      Start: new Date(),
      End: new Date(),
    },
  });

  const onDelete = async (id: string) => {
    await deleteExpense(id);
    mutate();
  };

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
    <div className="flex space-x-5 mt-5 ">
      <form className="space-y-4 w-64 min-w-[256px]" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="Type"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Expense type">
              <Select onChange={onChange} options={EXPENSE_TYPE_OPTIONS} selected={value} />
            </InputGroup>
          )}
        />

        <Controller
          control={control}
          name="OneTime"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Payment schedule">
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
      <ExpenseTable data={data} onDelete={onDelete} />
    </div>
  );
};

export const Route = createFileRoute('/expenses')({
  component: Expenses,
});

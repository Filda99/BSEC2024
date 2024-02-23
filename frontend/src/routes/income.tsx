import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { IncomeTable } from '@/components/IncomeTable';
import { Input } from '@/components/Input';
import { InputGroup } from '@/components/InputGroup';
import { Select } from '@/components/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { createIncome, deleteIncome } from '@/api/api';
import useSWR from 'swr';
import { FREQUENCY_OPTIONS, ONE_TIME_OPTIONS, INCOME_TYPE_OPTIONS } from '@/constants';

export type IncomeFormValues = {
  Type: number;
  OneTime: number;
  Frequency: number;
  Value: number;
  Start: Date;
  End: Date;
};

export type Income = {
  _id: string;
} & IncomeFormValues;

const Income = () => {
  const { data, isLoading, mutate } = useSWR('/Incomes');

  const { register, control, watch, handleSubmit } = useForm<IncomeFormValues>({
    defaultValues: {
      Value: 0,
      Type: 0,
      OneTime: 0,
      Frequency: 0,
      Start: new Date(),
      End: new Date(),
    },
  });

  const onDelete = async (id: string) => {
    await deleteIncome(id);
    mutate();
  };

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
    <div className="flex space-x-5 mt-5">
      <form className="space-y-4 max-w-64 min-w-[256px]" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="Type"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Income type">
              <Select onChange={onChange} options={INCOME_TYPE_OPTIONS} selected={value} />
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
      <IncomeTable data={data} onDelete={onDelete} />
    </div>
  );
};

export const Route = createFileRoute('/income')({
  component: Income,
});

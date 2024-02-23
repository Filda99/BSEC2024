import { createInvestments, deleteInvestment } from '@/api/api';
import { Input } from '@/components/Input';
import { InputGroup } from '@/components/InputGroup';
import { Select, SelectItem } from '@/components/Select';
import { ONE_TIME_OPTIONS, FREQUENCY_OPTIONS, INVESTMENT_TYPE_OPTIONS } from '@/constants';
import { createFileRoute } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import useSWR from 'swr';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/Button';
import { InvestmentsTable } from '@/components/InvestmentsTable';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { StockGrow } from '@/components/StockGrow';

export type InvestmentFormValues = {
  Type: number;
  OneTime: number;
  InvestmentId: string;
  Frequency: number;
  Value: number;
  Start: Date;
  End: Date;
};

export type Investment = {
  _id: string;
  InvestmentId: string;
} & InvestmentFormValues;

const Investments = () => {
  const { data: stocks, isLoading: stocksLoading } = useSWR('/Stocks');
  const { data: investments, isLoading: investmentLoading, mutate } = useSWR('/Investments');

  const { register, control, watch, handleSubmit } = useForm<InvestmentFormValues>({
    defaultValues: {
      Type: 0,
      OneTime: 0,
      InvestmentId: '65d7d71de35504b993e2dd68',
      Frequency: 0,
      Value: 100,
      Start: new Date(),
      End: new Date(),
    },
  });

  const onDelete = async (id: string) => {
    await deleteInvestment(id);
    mutate();
  };

  const { OneTime, InvestmentId, Value } = watch();

  const isPeriodicIncome = OneTime === 0;

  const onSubmit = async (data: InvestmentFormValues) => {
    const response = await createInvestments(data);
    if (response.status === 200) {
      mutate();
    }
  };

  if (stocksLoading || investmentLoading) {
    return null;
  }

  const chosenStockName = stocks.find(({ id }) => id === InvestmentId)!.name;

  return (
    <div className="flex space-x-5 mt-5">
      <form className="space-y-4 min-w-[256px]" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="Type"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Investment type">
              <Select onChange={onChange} options={INVESTMENT_TYPE_OPTIONS} selected={value} />
            </InputGroup>
          )}
        />

        <Controller
          control={control}
          name="InvestmentId"
          render={({ field: { value, onChange } }) => (
            <InputGroup label="Stock">
              <Select onChange={onChange} options={stocks as SelectItem[]} selected={value} />
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

        <Controller
          control={control}
          name="Start"
          render={({ field: { value, onChange } }) => (
            <InputGroup label={isPeriodicIncome ? 'From' : 'Date of payment'}>
              <DatePicker onChange={onChange} value={value} />
            </InputGroup>
          )}
        />

        {isPeriodicIncome && (
          <Controller
            control={control}
            name="End"
            render={({ field: { value, onChange } }) => (
              <InputGroup label="Until">
                <DatePicker onChange={onChange} value={value} />
              </InputGroup>
            )}
          />
        )}

        <InputGroup label="Value">
          <Input {...register('Value')} Icon={CurrencyDollarIcon} />
        </InputGroup>
        <Button type="submit">Sumbit</Button>
      </form>
      <div className="flex flex-col w-full space-y-4">
        <InvestmentsTable data={investments} stocks={stocks} onDelete={onDelete} />
        <div className="border rounded-md p-4 space-y-2">
          <h2 className="text-2xl text-center font-bold">{`${chosenStockName} future prediction`}</h2>
          <StockGrow invesmentId={InvestmentId} amount={Value} />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/investments')({
  component: Investments,
});

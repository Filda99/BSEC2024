import useSWR from 'swr';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { Line } from 'react-chartjs-2';
import { MONTHS } from '@/constants';

type StockGrowProps = {
  amount: number;
  invesmentId: string;
};

const formatChartData = predictions => {
  const pred = [predictions.neg, predictions.neut, predictions.pos];

  const currMonth = new Date().getMonth();
  console.log(currMonth);

  return {
    labels: Array.from({ length: pred[0].length }, (_, i) => MONTHS[(i + currMonth) % 12].name),
    datasets: [
      {
        label: 'Negative Scenario',
        data: pred[0],
        borderColor: '#dc2626',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Neutral Scenario',
        data: pred[1],
        borderColor: '#0284c7',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Positive Scenario',
        data: pred[2],
        borderColor: '#65a30d',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
};

export const StockGrow: React.FC<StockGrowProps> = ({ amount, invesmentId }) => {
  const { data, isLoading, isValidating } = useSWR(`/Investments/Prediction/${invesmentId}_${amount}`);

  if (isLoading || isValidating) {
    return (
      <div className="h-full flex items-center">
        <PacmanLoader className="mx-auto" color="#191817" />
      </div>
    );
  }

  const chartData1 = formatChartData(data);
  return <Line data={chartData1} />;
};

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createFileRoute } from '@tanstack/react-router';
import useSWR from 'swr';
import PacmanLoader from 'react-spinners/PacmanLoader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const formatChartData2 = data => {
  const labels = data.neg.map(dp => dp[0]); // Assuming all scenarios have the same labels

  const datasets = [
    {
      label: 'Negative scenario',
      data: data.neg.map(dp => dp[1]),
      borderColor: '#dc2626',
      borderWidth: 2,
    },
    {
      label: 'Neutral scenario',
      data: data.neut.map(dp => dp[1]),
      borderColor: '#0284c7',
      borderWidth: 2,
    },
    {
      label: 'Positive scenario',
      data: data.pos.map(dp => dp[1]),
      borderColor: '#65a30d',
      borderWidth: 2,
    },
  ];

  return {
    labels,
    datasets,
  };
};

const Dashboard = () => {
  const { data: data2, isLoading: loading2, isValidating: isValidating2 } = useSWR('/Wealth');

  if (loading2 || isValidating2) {
    return (
      <div className="h-full flex items-center">
        <PacmanLoader className="mx-auto" color="#191817" />
      </div>
    );
  }

  const chartData2 = formatChartData2(data2);

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-2xl font-semibold">Wealth Prediction Over Time</h2>
      <Line
        data={chartData2}
        options={{
          scales: {
            x: {
              time: {
                unit: 'day',
                tooltipFormat: 'YYYY-MM-DD',
              },
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        }}
      />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Dashboard,
});

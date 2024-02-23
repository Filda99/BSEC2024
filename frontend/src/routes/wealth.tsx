import React from 'react';
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
import { Fetcher } from '@/api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Wealth = () => {
  const { data, error, isLoading } = useSWR('/Wealth', Fetcher); // Using the mock useSWR

  const formatChartData = (data) => {
    const labels = data.neg.map(dp => dp[0]); // Assuming all scenarios have the same labels
    
    const datasets = [
      {
        label: 'Negative scenario',
        data: data.neg.map(dp => dp[1]),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: 'Neutral scenario',
        data: data.neut.map(dp => dp[1]),
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Positive scenario',
        data: data.pos.map(dp => dp[1]),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      }
    ];

    return {
      labels,
      datasets,
    };
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data!</div>;
  if (!data) return <div>No data available!</div>;

  const chartData = formatChartData(data);

  return (
    <div>
      <Line data={chartData} options={{
        scales: {
          x: {
            time: {
              unit: 'day',
              tooltipFormat: 'YYYY-MM-DD',
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Wealth Prediction Over Time'
          },
        },
      }} />
    </div>
  );
};

export const Route = createFileRoute('/wealth')({
  component: Wealth,
});

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
  
  // Register Chart.js components
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  
  const Dashboard = () => {
    const { data, error, isLoading } = useSWR('/Wealth'); // Adjust your fetch URL
  
    // Assuming your API returns an array of arrays for predictions
    // Each sub-array contains the predictions for one scenario
  
    const formatChartData = predictions => ({
      labels: Array.from({ length: predictions[0].length }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: 'Negative Scenario',
          data: predictions[0],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.4, // Adjust for smoothness, 0 for straight lines
          pointRadius: 0, // Set to 0 to hide points
        },
        {
          label: 'Neutral Scenario',
          data: predictions[1],
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4, // Adjust for smoothness
          pointRadius: 0, // Hide points
        },
        {
          label: 'Positive Scenario',
          data: predictions[2],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4, // Smoothness
          pointRadius: 0, // Hide points
        },
      ],
    });
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data!</div>;
  
    // Format the fetched data for the chart
    const chartData = formatChartData(data);
  
    return (
      <div>
        <Line data={chartData} />
      </div>
    );
  };
  
  export const Route = createFileRoute('/wealth')({
    component: Dashboard,
  });
  
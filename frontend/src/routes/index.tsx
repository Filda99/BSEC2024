import { createFileRoute } from '@tanstack/react-router';
import useSWR from 'swr';

const Dashboard = () => {
  const { data, error, isLoading } = useSWR('/')

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data!</div>;
  return <div>{data.message}</div>;
};

export const Route = createFileRoute('/')({
  component: Dashboard,
});

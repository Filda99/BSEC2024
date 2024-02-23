import { createFileRoute } from '@tanstack/react-router';
import { Fetcher } from '@/api/api';
import useSWR from 'swr';
import { format } from 'date-fns';

type Profile = {
  Name: string;
  Surname: string;
  DateOfBirth: Date;
  RetirementDate: Date;
};

const Profile = () => {
  const { data, error, isLoading } = useSWR<Profile>('/Profile', Fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data!</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {data?.Name}</p>
      <p>Surname: {data?.Surname}</p>
      <p>Date of birth: {format(data?.DateOfBirth, 'd. M. yyyy')}</p>
      <p>Retirement date: {format(data?.RetirementDate, 'd. M. yyyy')}</p>
    </div>
  );
};

export const Route = createFileRoute('/profile')({
  component: Profile,
});

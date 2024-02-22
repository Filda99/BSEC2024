import { createFileRoute } from '@tanstack/react-router';

const Profile = () => {
  return <div>Profile</div>;
};

export const Route = createFileRoute('/profile')({
  component: Profile,
});

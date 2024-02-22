import { createFileRoute } from '@tanstack/react-router';

const Investments = () => {
  return <div>Investments</div>;
};

export const Route = createFileRoute('/investments')({
  component: Investments,
});
